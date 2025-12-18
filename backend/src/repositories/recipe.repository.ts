// Recipe repository
import { Repository, DataSource } from 'typeorm';
import { Recipe } from '../entities/Recipe';
import { Attachment } from '../entities/Attachment';

export class RecipeRepository {
  private recipeRepository: Repository<Recipe>;
  private attachmentRepository: Repository<Attachment>;

  constructor(datasource: DataSource) {
    this.recipeRepository = datasource.getRepository(Recipe);
    this.attachmentRepository = datasource.getRepository(Attachment);
  }

  async save(recipe: Recipe): Promise<Recipe> {
    return this.recipeRepository.save(recipe);
  }

  async findById(id: number): Promise<Recipe | null> {
    return this.recipeRepository.findOne({
      where: { id },
      relations: [
        'user',
        'area',
        'categories',
        'thumbnails',
        'steps',
        'steps.attachments',
        'recipeIngredients',
        'recipeIngredients.ingredient',
        'votes',
        'votes.user',
      ],
      order: {
        steps: {
          order: 'ASC',
        },
        recipeIngredients: {
          order: 'ASC',
        },
      },
    });
  }

  async findAll(): Promise<Recipe[]> {
    return this.recipeRepository.find({
      relations: [
        'user',
        'area',
        'categories',
        'thumbnails',
        'votes',
      ],
    });
  }

  async getAllAttachments(recipeId: number): Promise<Attachment[]> {
    const recipe = await this.recipeRepository.findOne({
      where: { id: recipeId },
      relations: ['thumbnails', 'steps', 'steps.attachments'],
    });

    if (!recipe) {
      return [];
    }

    const attachments: Attachment[] = [];

    // Collect thumbnails
    if (recipe.thumbnails) {
      attachments.push(...recipe.thumbnails);
    }

    // Collect step attachments
    if (recipe.steps) {
      recipe.steps.forEach(step => {
        if (step.attachments) {
          attachments.push(...step.attachments);
        }
      });
    }

    return attachments;
  }

  async deleteAttachments(attachmentIds: number[]): Promise<void> {
    if (attachmentIds.length > 0) {
      await this.attachmentRepository.delete(attachmentIds);
    }
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.recipeRepository.delete(id);
    return result.affected !== 0;
  }
}
