import Animal from '@/databases/entities/Animal';

class AnimalRouterService {
  async createAnimal(
    name: string,
    shape: string,
    species: string,
    age: string,
    habitat: string,
    diet: string,
    isDangerous: boolean,
    isEndangered: boolean,
    description: string
  ) {
    const animal = new Animal({
      name,
      shape,
      species,
      age,
      habitat,
      diet,
      isEndangered,
      isDangerous,
      description,
    });
    return await animal.save();
  }
  async deleteAnimal(id: string) {
    return await Animal.findByIdAndDelete(id);
  }
  async getAllAnimal() {
    return await Animal.find();
  }
}
export default new AnimalRouterService();
