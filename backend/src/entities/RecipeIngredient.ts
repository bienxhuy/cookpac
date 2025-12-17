import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Recipe } from "./Recipe";
import { Ingredient } from "./Ingredient";

@Entity()
export class RecipeIngredient extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "float" })
  quantity!: number;

  @Column()
  unit!: string;

  @ManyToOne(() => Recipe, recipe => recipe.recipeIngredients)
  recipe!: Recipe;

  @ManyToOne(() => Ingredient, ingredient => ingredient.recipeIngredients)
  ingredient!: Ingredient;
}
