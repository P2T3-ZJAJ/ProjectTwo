import { DataTypes, Sequelize, Model, Optional } from 'sequelize';

interface UserRecipeAttributes {
  id: number;
  userId: number;
  recipeId: number;
}

interface UserRecipeCreationAttributes extends Optional<UserRecipeAttributes, 'id'> {}

export class UserRecipe extends Model<UserRecipeAttributes, UserRecipeCreationAttributes> implements UserRecipeAttributes {
  public id!: number;
  public userId!: number;
  public recipeId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function UserRecipeFactory(sequelize: Sequelize): typeof UserRecipe {
  UserRecipe.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      recipeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'recipes',
          key: 'id',
        },
      },
    },
    {
      tableName: 'user_recipes',
      sequelize,
    }
  );

  return UserRecipe;
}