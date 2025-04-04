import { DataTypes, Sequelize, Model, Optional } from 'sequelize';

interface RecipeAttributes {
  id: number;
  mealId: string;
  name: string;
  category: string;
  area: string;
  instructions: string;
  thumbnail: string;
  youtubeLink?: string;
}

interface RecipeCreationAttributes extends Optional<RecipeAttributes, 'id'> {}

export class Recipe extends Model<RecipeAttributes, RecipeCreationAttributes> implements RecipeAttributes {
  public id!: number;
  public mealId!: string;
  public name!: string;
  public category!: string;
  public area!: string;
  public instructions!: string;
  public thumbnail!: string;
  public youtubeLink!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function RecipeFactory(sequelize: Sequelize): typeof Recipe {
  Recipe.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      mealId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      area: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      instructions: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      thumbnail: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      youtubeLink: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: 'recipes',
      sequelize,
    }
  );

  return Recipe;
}