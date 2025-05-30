import mongoose from 'mongoose';

const StepSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    tips: [{ type: String }],
  },
  { _id: false }
);

const TrainingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    difficulty: {
      type: String,
      enum: ['Dễ', 'Trung bình', 'Khó'],
      default: 'Trung bình',
    },
    duration: { type: String }, // Ví dụ: "2-4 tuần"
    steps: [StepSchema],
  },
  { timestamps: true, collection: 'trainings' }
);

const Training = mongoose.model('Training', TrainingSchema);
export default Training;
