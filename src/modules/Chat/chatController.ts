import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import BadRequestException from '@/common/exception/BadRequestException';
import AuthErrorCode from '@/utils/AuthErrorCode';
import axios from 'axios';
import dotenv from 'dotenv';
import ChatService from './chatService';
import { AuthenticatedRequest } from '@/hook/AuthenticatedRequest';
import { HttpStatusCode } from '@/utils/httpStatusCode';
import path from 'path';
import fs from 'fs';
dotenv.config();

import QdrantService from '@/databases/qdrant.service';
import { ChatMessage } from '@/databases/entities/ChatMessage';
import { generateEmbedding } from '@/hook/generateEmbedding';

class ChatController {
  async getChatHistory(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new BadRequestException(errors.array());
    }

    try {
      const { userId } = req.params;
      if (!userId) {
        throw new BadRequestException({
          errorCode: AuthErrorCode.EXISTS_USER,
          errorMessage: 'User ID is required',
        });
      }
      const messages = await ChatService.getChatHistory(userId);

      return res.status(HttpStatusCode.OK).json({
        httpStatusCode: HttpStatusCode.OK,
        data: messages,
      });
    } catch (error) {
      next(error);
    }
  }

  async chatWithAI(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new BadRequestException(errors.array());
    }

    try {
      const userId = req.user?.id || req.body.userId;
      const { content } = req.body;

      if (!userId || !content) {
        throw new BadRequestException({
          errorCode: 'MISSING_FIELDS',
          errorMessage: 'User ID and content are required',
        });
      }

      await ChatService.saveMessage(userId, 'user', content);

      const queryVector = await generateEmbedding(content);

      const qdrant = QdrantService.getInstance().getClient();
      const searchResults = await qdrant.search('chat_messages', {
        vector: queryVector,
        limit: 5,
      });

      const similarMessageIds = searchResults.map((p) => p.id?.toString());

      const usefulAnswers = await ChatMessage.find({
        _id: { $in: similarMessageIds },
        role: 'assistant',
        feedback: 'useful',
      })
        .sort({ createdAt: -1 }) // lấy những tin mới nhất trước
        .lean(); //tối ứu hóa trả về objects thường

      const notUsefulAnswers = await ChatMessage.find({
        _id: { $in: similarMessageIds },
        role: 'assistant',
        feedback: 'not_useful',
      })
        .sort({ createdAt: -1 })
        .lean();
      const contextUseful = usefulAnswers
        .map((a) => `• ${a.content}`)
        .join('\n');
      const contextNotUseful = notUsefulAnswers
        .map((a) => `• ${a.content}`)
        .join('\n');

      const systemPrompt =
        `${contextNotUseful ? `⚠️ Tránh trả lời giống các phản hồi không hữu ích trước đó:\n${contextNotUseful}\n` : ''}
                            ${contextUseful ? `✅ Dưới đây là các phản hồi hữu ích từ trước:\n${contextUseful}\n` : ''}
---
Hãy trả lời người dùng một cách rõ ràng, chính xác, ngắn gọn và có thể cải tiến nếu cần.
`.trim();

      const apiKey = process.env.OPENAI_API_KEY;
      console.log(apiKey);
      if (!apiKey) {
        throw new Error('API key is not configured');
      }

      const aiResponse = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'deepseek/deepseek-r1:free',
          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            {
              role: 'user',
              content,
            },
          ],
        },
        {
          timeout: 10000,
          headers: {
            Authorization: ` OpenRouter-API-Key ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!aiResponse.data?.choices?.[0]?.message) {
        throw new Error('Invalid response from AI service');
      }

      const aiMessage = aiResponse.data.choices[0].message;

      const savedAIMessage = await ChatService.saveMessage(
        userId,
        'assistant',
        aiMessage.content
      );

      const answerVector = await generateEmbedding(aiMessage.content);
      await qdrant.upsert('chat_messages', {
        points: [
          {
            id: savedAIMessage._id.toString(),
            vector: answerVector,
            payload: {
              userId,
              role: 'assistant',
              message: aiMessage.content,
              timestamp: savedAIMessage.createdAt,
            },
          },
        ],
      });

      return res.status(HttpStatusCode.OK).json({
        httpStatusCode: HttpStatusCode.OK,
        data: savedAIMessage,
      });
    } catch (error) {
      console.error(
        'Error in chatWithAI:',
        error.response?.data || error.message || error
      );
      next(error);
    }
  }

  async giveFeedback(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new BadRequestException(errors.array()));
    }

    try {
      const { messageId, feedback } = req.body;
      if (!messageId || !['useful', 'not_useful'].includes(feedback)) {
        throw new BadRequestException({
          errorCode: 'INVALID_INPUT',
          errorMessage:
            'messageId and valid feedback (useful/not_useful) are required.',
        });
      }

      const updatedMessage = await ChatService.giveFeedback({
        messageId,
        feedback,
      });

      if (!updatedMessage) {
        throw new Error('Message not found');
      }

      return res.status(HttpStatusCode.OK).json({
        httpStatusCode: HttpStatusCode.OK,
        message: 'Feedback submitted successfully',
        data: updatedMessage,
      });
    } catch (error) {
      next(error);
    }
  }

  async clearChatHistory(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new BadRequestException(errors.array());
    }

    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new BadRequestException({
          errorCode: AuthErrorCode.EXISTS_USER,
          errorMessage: 'User ID is required',
        });
      }

      await ChatService.clearChatHistory(userId);
      return res.status(HttpStatusCode.OK).json({
        httpStatusCode: HttpStatusCode.OK,
        data: 'Chat history cleared successfully',
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  async Diagnostic(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new BadRequestException(errors.array());
    }
    try {
      const userId = req.user?.id || req.body.userId;
      const { content } = req.body;
      if (!userId || !content) {
        throw new BadRequestException({
          errorCode: 'MISSING_FIELDS',
          errorMessage: 'User ID, role and content are required',
        });
      }
      await ChatService.saveMessage(userId, 'user', content, 'diagnostic');

      const filePath = path.join(__dirname, 'a.txt');
      let rawContent = fs.readFileSync(filePath, 'utf8');
      rawContent = rawContent.replace(/\r?\n/g, '\n');
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error('API key is not configured');
      }
      const aiResponse = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'deepseek/deepseek-r1:free',
          messages: [
            {
              role: 'system',
              content: rawContent,
            },
            {
              role: 'user',
              content,
            },
          ],
        },
        {
          timeout: 10000,
          headers: {
            Authorization: `OpenRouter-API-Key ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!aiResponse.data?.choices?.[0]?.message) {
        throw new Error('Invalid response from AI service');
      }

      const aiMessage = aiResponse.data.choices[0].message;
      const savedAIMessage = await ChatService.saveMessage(
        userId,
        'assistant',
        aiMessage.content,
        'diagnostic'
      );
      return res.status(HttpStatusCode.OK).json({
        httpStatusCode: HttpStatusCode.OK,
        data: savedAIMessage,
      });
    } catch (error) {
      console.error(
        'Error in chatWithAI:',
        error.response?.data || error.message || error
      );
      next(error);
    }
  }
  async getChatHistoryByDiagnostic(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new BadRequestException(errors.array());
    }

    try {
      const { userId } = req.params;
      if (!userId) {
        throw new BadRequestException({
          errorCode: AuthErrorCode.EXISTS_USER,
          errorMessage: 'User ID is required',
        });
      }
      const messages = await ChatService.getChatHistoryByDiagnostic(userId);

      return res.status(HttpStatusCode.OK).json({
        httpStatusCode: HttpStatusCode.OK,
        data: messages,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

export default new ChatController();
