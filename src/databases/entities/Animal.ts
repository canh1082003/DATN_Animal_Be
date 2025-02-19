import mongoose from 'mongoose';

const AnimalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    shape: { type: String, required: true },
    species: { type: String, required: true }, // Loài động vật
    age: { type: String, required: true }, // Tuổi
    habitat: { type: String }, // Môi trường sống
    diet: {
      type: String,
      enum: ['anco', 'anthit', 'antap'],
      required: true,
    },
    isEndangered: { type: Boolean, default: false }, // Có phải động vật quý hiếm không
    isDangerous: { type: Boolean, default: false }, //nguy hiểm
    description: { type: String, default: '' },
  },
  { timestamps: true, collection: 'animals' }
);

const Animal = mongoose.model('Animal', AnimalSchema);
export default Animal;
