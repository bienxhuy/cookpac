import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";
import { Recipe } from "./Recipe";

@Entity()
export class Vote extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, user => user.votes)
  user!: User;

  @ManyToOne(() => Recipe, recipe => recipe.votes)
  recipe!: Recipe;
}
