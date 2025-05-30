import { Router } from 'express';
import ChatController from './chatController';
import verifyTokenMiddleware, {
  validateGiveFeedback,
} from '@/middlewares/chat.middlewares';

const chatRouter = Router();

chatRouter.post('/Diagnostic/message', ChatController.Diagnostic);
chatRouter.post('/message', ChatController.chatWithAI);

chatRouter.delete(
  '/deleteChat/:userId',
  verifyTokenMiddleware,
  ChatController.clearChatHistory
);
chatRouter.get(
  '/history/:userId',
  verifyTokenMiddleware,
  ChatController.getChatHistory
);
chatRouter.get(
  '/diagnostic/history/:userId',
  verifyTokenMiddleware,
  ChatController.getChatHistoryByDiagnostic
);
chatRouter.post(
  '/feedback',
  verifyTokenMiddleware,
  validateGiveFeedback,
  ChatController.giveFeedback
);
export default chatRouter;
