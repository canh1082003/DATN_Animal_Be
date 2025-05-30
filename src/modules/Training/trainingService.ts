import Training from '@/databases/entities/Training';

class trainingService {
  async getAllTraining() {
    return await Training.find();
  }
  async createTraining(data: any) {
    const training = new Training(data);
    return await training.save();
  }
  async updateTraining(id: string, data: any) {
    return await Training.findByIdAndUpdate(id, data, { new: true });
  }
  async deleteTraining(id: string) {
    return await Training.findByIdAndDelete(id);
  }
}
export default new trainingService();
