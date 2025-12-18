// Recipe controller
import { Request, Response } from 'express';
import { RecipeService } from '../services/recipe.service';

export class RecipeController {
  private recipeService: RecipeService;

  constructor(recipeService: RecipeService) {
    this.recipeService = recipeService;
  }

  // Create recipe
  // POST /recipes
  async createRecipe(req: Request, res: Response): Promise<void> {
    try {
      const {
        name,
        description,
        areaId,
        categoryIds,
        thumbnailImages,
        steps,
        recipeIngredients
      } = req.body;

      // Validation
      if (!name || !description || !areaId) {
        res.status(400).json({
          status: "error",
          message: 'Name, description, and areaId are required'
        });
        return;
      }

      if (!categoryIds || !Array.isArray(categoryIds) || categoryIds.length === 0) {
        res.status(400).json({
          status: "error",
          message: 'At least one category is required'
        });
        return;
      }

      // Convert base64 images to buffers
      const thumbnailBuffers: Buffer[] = [];
      if (thumbnailImages && Array.isArray(thumbnailImages)) {
        for (const imgData of thumbnailImages) {
          if (imgData.data) {
            thumbnailBuffers.push(Buffer.from(imgData.data, 'base64'));
          }
        }
      }

      // Process steps with images
      const processedSteps: { order: number; description: string; images?: Buffer[] }[] = [];
      if (steps && Array.isArray(steps)) {
        for (let i = 0; i < steps.length; i++) {
          const step = steps[i];
          const stepImages: Buffer[] = [];
          if (step.images && Array.isArray(step.images)) {
            for (const imgData of step.images) {
              if (imgData.data) {
                stepImages.push(Buffer.from(imgData.data, 'base64'));
              }
            }
          }
          processedSteps.push({
            order: step.order !== undefined ? step.order : i + 1,
            description: step.description,
            images: stepImages.length > 0 ? stepImages : undefined,
          });
        }
      }

      // Process recipe ingredients with order
      const processedIngredients: { ingredientId: number; order: number; quantity: number; unit: string }[] = [];
      if (recipeIngredients && Array.isArray(recipeIngredients)) {
        for (let i = 0; i < recipeIngredients.length; i++) {
          const ri = recipeIngredients[i];
          processedIngredients.push({
            ingredientId: ri.ingredientId,
            order: ri.order !== undefined ? ri.order : i + 1,
            quantity: ri.quantity,
            unit: ri.unit,
          });
        }
      }

      // Hardcode userId to 1 for now
      const userId = 1;

      const recipe = await this.recipeService.createRecipe({
        name,
        description,
        userId,
        areaId: parseInt(areaId),
        categoryIds: categoryIds.map((id: any) => parseInt(id)),
        thumbnailImages: thumbnailBuffers.length > 0 ? thumbnailBuffers : undefined,
        steps: processedSteps.length > 0 ? processedSteps : undefined,
        recipeIngredients: processedIngredients.length > 0 ? processedIngredients : undefined,
      });

      res.status(201).json({ status: "success", data: recipe });
    }
    catch (error) {
      console.error('Error creating recipe:', error);
      if (error instanceof Error) {
        res.status(400).json({ status: "error", message: error.message });
      } else {
        res.status(500).json({ status: "error", message: 'Internal server error' });
      }
    }
  }

  // Get recipe by ID
  // GET /recipes/:id
  async getRecipe(req: Request, res: Response): Promise<void> {
    try {
      const recipeId = parseInt(req.params.id, 10);
      const recipe = await this.recipeService.getRecipeById(recipeId);
      
      if (recipe) {
        res.json({ status: "success", data: recipe });
      } else {
        res.status(404).json({ status: "error", message: 'Recipe not found' });
      }
    }
    catch (error) {
      console.error('Error fetching recipe:', error);
      res.status(500).json({ status: "error", message: 'Internal server error' });
    }
  }

  // Get all recipes
  // GET /recipes
  async getAllRecipes(req: Request, res: Response): Promise<void> {
    try {
      const recipes = await this.recipeService.getAllRecipes();
      res.json({ status: "success", data: recipes });
    }
    catch (error) {
      console.error('Error fetching recipes:', error);
      res.status(500).json({ status: "error", message: 'Internal server error' });
    }
  }

  // Update recipe by ID
  // PUT /recipes/:id
  async updateRecipe(req: Request, res: Response): Promise<void> {
    try {
      const recipeId = parseInt(req.params.id, 10);
      const {
        name,
        description,
        areaId,
        categoryIds,
        thumbnailImages,
        steps,
        recipeIngredients
      } = req.body;

      const updateData: any = {};

      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (areaId !== undefined) updateData.areaId = parseInt(areaId);
      if (categoryIds !== undefined) {
        updateData.categoryIds = categoryIds.map((id: any) => parseInt(id));
      }

      // Convert base64 images to buffers
      if (thumbnailImages !== undefined) {
        const thumbnailBuffers: Buffer[] = [];
        if (Array.isArray(thumbnailImages)) {
          for (const imgData of thumbnailImages) {
            if (imgData.data) {
              thumbnailBuffers.push(Buffer.from(imgData.data, 'base64'));
            }
          }
        }
        updateData.thumbnailImages = thumbnailBuffers;
      }

      // Process steps with images
      if (steps !== undefined) {
        const processedSteps: { order: number; description: string; images?: Buffer[] }[] = [];
        if (Array.isArray(steps)) {
          for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            const stepImages: Buffer[] = [];
            if (step.images && Array.isArray(step.images)) {
              for (const imgData of step.images) {
                if (imgData.data) {
                  stepImages.push(Buffer.from(imgData.data, 'base64'));
                }
              }
            }
            processedSteps.push({
              order: step.order !== undefined ? step.order : i + 1,
              description: step.description,
              images: stepImages.length > 0 ? stepImages : undefined,
            });
          }
        }
        updateData.steps = processedSteps;
      }

      // Process recipe ingredients with order
      if (recipeIngredients !== undefined) {
        const processedIngredients: { ingredientId: number; order: number; quantity: number; unit: string }[] = [];
        if (Array.isArray(recipeIngredients)) {
          for (let i = 0; i < recipeIngredients.length; i++) {
            const ri = recipeIngredients[i];
            processedIngredients.push({
              ingredientId: ri.ingredientId,
              order: ri.order !== undefined ? ri.order : i + 1,
              quantity: ri.quantity,
              unit: ri.unit,
            });
          }
        }
        updateData.recipeIngredients = processedIngredients;
      }

      const recipe = await this.recipeService.updateRecipe(recipeId, updateData);
      
      if (recipe) {
        res.json({ status: "success", data: recipe });
      } else {
        res.status(404).json({ status: "error", message: 'Recipe not found' });
      }
    }
    catch (error) {
      console.error('Error updating recipe:', error);
      if (error instanceof Error) {
        res.status(400).json({ status: "error", message: error.message });
      } else {
        res.status(500).json({ status: "error", message: 'Internal server error' });
      }
    }
  }

  // Delete recipe by ID
  // DELETE /recipes/:id
  async deleteRecipe(req: Request, res: Response): Promise<void> {
    try {
      const recipeId = parseInt(req.params.id, 10);
      await this.recipeService.deleteRecipe(recipeId);
      res.status(204).send();
    }
    catch (error) {
      console.error('Error deleting recipe:', error);
      if (error instanceof Error && error.message === 'Recipe not found') {
        res.status(404).json({ status: "error", message: 'Recipe not found' });
      } else {
        res.status(500).json({ status: "error", message: 'Internal server error' });
      }
    }
  }
}
