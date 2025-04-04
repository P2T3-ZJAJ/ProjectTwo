import sequelize from '../config/connection.js'
import { UserFactory } from './user.js';
import { RecipeFactory } from './recipe.js';
import { UserRecipeFactory } from './userRecipe.js';

const User = UserFactory(sequelize);
const Recipe = RecipeFactory(sequelize);
const UserRecipe = UserRecipeFactory(sequelize);

// define associations
User.belongsToMany(Recipe, { through: UserRecipe, foreignKey: 'userId' });
Recipe.belongsToMany(User, { through: UserRecipe, foreignKey: 'recipeId' });

export { User, Recipe, UserRecipe };