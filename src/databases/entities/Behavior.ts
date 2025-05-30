import mongoose from 'mongoose';

const BehaviorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    relatedBreeds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DogBreed' }],
    tips: [{ type: String }],
  },
  { timestamps: true, collection: 'behaviors' }
);

const Behavior = mongoose.model('Behavior', BehaviorSchema);
export default Behavior;
