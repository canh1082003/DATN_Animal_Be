import mongoose from 'mongoose';

const LibrarySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ['Đuôi', 'Tai', 'Mắt', 'Tư thế', 'Miệng'],
    },
    description: { type: String, default: '' },
    images: [{ type: String }],
    tags: [
      {
        type: String,
        enum: [
          'Phấn khích',
          'Cảnh giác',
          'Tự tin',
          'Thống trị',
          'Sợ hãi',
          'Phục tùng',
          'Lo lắng',
          'Tập trung',
          'Thân thiện',
          'Thoải mái',
          'Thư giãn',
          'Thách thức',
          'Tình cảm',
          'Vui vẻ',
          'Tích cực',
        ],
        required: true,
      },
    ],

    mainMeaning: { type: String },
    commonCases: [{ type: String }],
    importantNote: { type: String },
    distinguishingSigns: [{ type: String }],
    reaction: { type: String },
  },
  { timestamps: true, collection: 'libraries' }
);

const Library = mongoose.model('Library', LibrarySchema);
export default Library;
