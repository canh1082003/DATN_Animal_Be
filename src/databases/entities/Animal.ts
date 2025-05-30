import mongoose from 'mongoose';

const DogBreedSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Tên giống chó
    origin: { type: String }, // Nguồn gốc
    description: { type: String, default: '' }, // Mô tả
    images: [{ type: String }], // Danh sách link ảnh
    temperament: [{ type: String }], // Tính cách
    lifeSpan: { type: String }, // Tuổi thọ (ví dụ: "10-12 years")
    weight: {
      min: { type: Number },
      max: { type: Number },
    },
    height: {
      min: { type: Number },
      max: { type: Number },
    },
    group: { type: String }, // Nhóm chó (nếu có)
    otherNames: [{ type: String }], // Tên gọi khác
  },
  { timestamps: true, collection: 'dog_breeds' }
);

const DogBreed = mongoose.model('DogBreed', DogBreedSchema);
export default DogBreed;
