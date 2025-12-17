import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Recipe } from "./Recipe";

@Entity()
export class Area extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @OneToMany(() => Recipe, recipe => recipe.area)
  recipes!: Recipe[];
}
