// Ingredient repository
import { Repository, DataSource } from 'typeorm';
import { Ingredient } from '../entities/Ingredient';

export class IngredientRepository {
  private repository: Repository<Ingredient>;

  constructor(datasource: DataSource) {
    this.repository = datasource.getRepository(Ingredient);
  }

  async create(name: string): Promise<Ingredient> {
    const ingredient = this.repository.create({ name });
    return this.repository.save(ingredient);
  }

  async findById(id: number): Promise<Ingredient | null> {
    return this.repository.findOneBy({ id });
  }

  async findByName(name: string): Promise<Ingredient | null> {
    return this.repository.findOneBy({ name });
  }

  async findAll(): Promise<Ingredient[]> {
    return this.repository.find();
  }

  async update(id: number, name: string): Promise<Ingredient | null> {
    const ingredient = await this.repository.findOneBy({ id });
    if (!ingredient) {
      return null;
    }
    ingredient.name = name;
    return this.repository.save(ingredient);
  }
}
