import mongoose from 'mongoose';

export interface IChatMessage {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  role: 'user' | 'ai';
  content: string;
  createdAt: Date;
  updatedAt: Date;
  type?: 'normal' | 'diagnostic';
  feedback?: 'useful' | 'not_useful';
  feedbackComment?: string;
}

const ChatMessageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'system', 'assistant'],
      required: true,
      default: 'user',
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    type: {
      type: String,
      enum: ['normal', 'diagnostic'],
    },
    feedback: {
      type: String,
      enum: ['useful', 'not_useful'],
      default: null,
    },
    feedbackComment: {
      type: String,
    },
  },
  { timestamps: true, collection: 'chat_messages' }
);

export const ChatMessage = mongoose.model<IChatMessage>(
  'ChatMessage',
  ChatMessageSchema
);
