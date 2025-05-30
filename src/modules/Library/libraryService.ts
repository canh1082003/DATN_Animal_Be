import Library from '@/databases/entities/Library';

class libraryService {
  async getAllLibrary() {
    return await Library.find();
  }
  async createLibrary(data: any) {
    return await Library.create(data);
  }
  async updateLibrary(id: string, data: any) {
    return await Library.findByIdAndUpdate(id, data, { new: true });
  }
  async deleteLibrary(id: string) {
    return await Library.findByIdAndDelete(id);
  }
  async getLibraryById(id: string) {
    return await Library.findById(id);
  }
  async getLibraryByType(type: string) {
    return await Library.find({ type });
  }
}
export default new libraryService();
