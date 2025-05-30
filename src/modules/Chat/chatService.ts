import { Types } from 'mongoose';
import { ChatMessage, IChatMessage } from '@/databases/entities/ChatMessage';
import { GiveFeedbackInput } from './type';

class ChatService {
  async getChatHistoryByDiagnostic(userId: string): Promise<IChatMessage[]> {
    const messages = await ChatMessage.find({
      userId: new Types.ObjectId(userId),
      role: { $ne: 'system' },
      type: 'diagnostic',
    }).sort({ timestamp: 'asc' });
    return messages;
  }
  async getChatHistory(userId: string): Promise<IChatMessage[]> {
    const messages = await ChatMessage.find({
      userId: new Types.ObjectId(userId),
      role: { $ne: 'system' },
      type: 'normal',
    }).sort({ timestamp: 'asc' });
    return messages;
  }

  async saveMessage(
    userId: string,
    role: string,
    content: string,
    type: 'normal' | 'diagnostic' = 'normal'
  ): Promise<IChatMessage> {
    const chatMessage = new ChatMessage({
      userId: new Types.ObjectId(userId),
      role,
      content,
      type: type || 'normal',
      timestamp: new Date(),
    });

    return await chatMessage.save();
  }

  async clearChatHistory(userId: string) {
    return await ChatMessage.deleteMany({ userId: new Types.ObjectId(userId) });
  }
  async giveFeedback(input: GiveFeedbackInput) {
    const { messageId, feedback } = input;

    if (!Types.ObjectId.isValid(messageId)) {
      return null;
    }

    const updated = await ChatMessage.findByIdAndUpdate(
      messageId,
      {
        feedback,
      },
      { new: true }
    );

    return updated;
  }
}

export default new ChatService();
