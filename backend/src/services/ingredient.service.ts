// Ingredient service
import { IngredientRepository } from '../repositories/ingredient.repository';
import { Ingredient } from '../entities/Ingredient';

export class IngredientService {
  private ingredientRepository: IngredientRepository;

  constructor(ingredientRepository: IngredientRepository) {
    this.ingredientRepository = ingredientRepository;
  }

  async createIngredient(name: string): Promise<Ingredient> {
    const existingIngredient = await this.ingredientRepository.findByName(name);
    if (existingIngredient) {
      throw new Error('Ingredient name already exists');
    }
    return this.ingredientRepository.create(name);
  }

  async getIngredientById(id: number): Promise<Ingredient | null> {
    return this.ingredientRepository.findById(id);
  }

  async getAllIngredients(): Promise<Ingredient[]> {
    return this.ingredientRepository.findAll();
  }

  async updateIngredient(id: number, name: string): Promise<Ingredient | null> {
    const existingIngredient = await this.ingredientRepository.findByName(name);
    if (existingIngredient && existingIngredient.id !== id) {
      throw new Error('Ingredient name already exists');
    }
    return this.ingredientRepository.update(id, name);
  }
}
