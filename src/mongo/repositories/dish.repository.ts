import { Injectable } from '@nestjs/common';
import BaseRepository from './base.repository';
import { Dish } from '../models/dish.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class DishRepository extends BaseRepository<Dish> {
  constructor(@InjectModel(Dish.name) private model: Model<Dish>) {
    super(model);
  }

  async findTop20Ingredients() {
    return this.Model.aggregate([
      { $unwind: '$ingredients' },
      {
        $lookup: {
          from: 'ingredients',
          localField: 'ingredients.ingredientId',
          foreignField: '_id',
          as: 'ingredientDetails',
        },
      },
      { $unwind: '$ingredientDetails' },
      {
        $group: {
          _id: '$ingredientDetails._id', // Grouper par _id de l'ingrédient
          name: { $first: '$ingredientDetails.name' }, // Conserver le premier nom trouvé pour cet _id (ils devraient tous être les mêmes)
          totalUsage: { $sum: 1 }, // Compter le nombre d'utilisations
        },
      },
      { $sort: { totalUsage: -1 } }, // Trier par utilisation décroissante
      { $limit: 20 }, // Limiter aux 20 premiers
      { $project: { _id: 1, name: '$name' } }, // Projet pour transformer le nom en majuscules et inclure _id
    ]);
  }
}
