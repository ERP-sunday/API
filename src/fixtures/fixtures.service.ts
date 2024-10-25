import { Injectable } from '@nestjs/common';

@Injectable()
export class FixturesService {
  // constructor(
  //   @InjectModel(Dish.name) private dishModel: Model<Dish>,
  //   @InjectModel(Ingredient.name) private ingredientModel: Model<Ingredient>,
  // ) {}

  async insertFixtures(): Promise<void> {
    // const ingredientIdMap = await this.insertIngredientFixtures();
    // await this.insertDishFixtures(ingredientIdMap);
  }

  // private async insertIngredientFixtures(): Promise<string[]> {
  //   await this.ingredientModel.deleteMany({});
  //
  //   const ingredientFixtures = Array.from({ length: 20 }).map(() => ({
  //     name: faker.commerce.productName(),
  //   }));
  //
  //   const ingredients =
  //     await this.ingredientModel.insertMany(ingredientFixtures);
  //   const ingredientsId = ingredients.map((ingredient) =>
  //     ingredient._id.toString(),
  //   );
  //
  //   return ingredientsId;
  // }

  // private async insertDishFixtures(ingredientsId: string[]): Promise<void> {
  //   await this.dishModel.deleteMany({});
  //
  //   const ingredients = [];
  //
  //   for (let index = 0; index < faker.number.int({ min: 1, max: 3 }); index++) {
  //     ingredients.push({
  //       ingredientId:
  //         ingredientsId[faker.number.int({ max: ingredientsId.length - 1 })],
  //       unity: DishIngredientUnity.CENTILITRE,
  //       quantity: faker.number.int({ max: 5 }),
  //     });
  //   }
  //
  //   const dishFixtures = Array.from({ length: 10 }).map(() => ({
  //     name: faker.commerce.productName(),
  //     ingredients: ingredients,
  //     price: faker.commerce.price({ max: 100 }),
  //     description: faker.commerce.productDescription(),
  //     category: DishCategory.MEAT,
  //     timeCook: faker.number.int({ min: 10, max: 60 }),
  //     isAvailable: faker.datatype.boolean(),
  //   }));
  //
  //   await this.dishModel.insertMany(dishFixtures);
  // }
}
