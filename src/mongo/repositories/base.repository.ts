import {
  Document,
  FilterQuery as MongooseFilterQuery,
  Model,
  Types,
  UpdateQuery,
} from 'mongoose';
import { BadRequestException } from '@nestjs/common';

class BaseRepository<T extends Document> {
  readonly Model: Model<T>;

  constructor(model: Model<T>) {
    this.Model = model;
  }

  async insert(data: FilterQuery<T>): Promise<Document<unknown, {}, T>> {
    try {
      const newObject = new this.Model(data);
      await newObject.validate();

      const insertedObject = await newObject.save();

      return insertedObject.toObject({ versionKey: false });
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }

  async findOneBy(
    condition: FilterQuery<T>,
    params?: AdditionalParams,
  ): Promise<T | null> {
    try {
      const finedObject = await this.Model.findOne(condition)
        .select(
          (params?.hiddenPropertiesToSelect || [])
            .map((property) => `+${property}`)
            .join(' '),
        )
        .populate((params?.populate || []).join(' '));

      // @ts-ignore
      return finedObject.toObject({ versionKey: false }) || null;
    } catch (e) {
      return null;
    }
  }

  async findOneById(_id: string, params?: AdditionalParams): Promise<T | null> {
    // @ts-ignore
    return this.findOneBy({ _id }, params);
  }

  async deleteOnyBy(condition: FilterQuery<T>): Promise<boolean> {
    try {
      return (await this.Model.deleteOne(condition)).deletedCount > 0;
    } catch {
      return false;
    }
  }

  async updateOneBy(
    condition: FilterQuery<T>,
    set: DataType,
  ): Promise<boolean> {
    try {
      const { _id, ...data } = set;
      const update = await this.Model.updateOne(condition, {
        $set: data as UpdateQuery<T>,
        $inc: { __v: 1 },
      });
      return update.modifiedCount > 0;
    } catch {
      return false;
    }
  }

  async findManyBy(
    condition: FilterQuery<T>,
    params?: AdditionalParams,
  ): Promise<T[]> {
    try {
      const finedObject = await this.Model.find(condition)
        .select(
          (params?.hiddenPropertiesToSelect || [])
            .map((property) => `+${property}`)
            .join(' '),
        )
        .populate((params?.populate || []).join(' '));

      return finedObject.map((e) => e.toObject({ versionKey: false }));
    } catch {
      return [];
    }
  }

  async findAll(params?: AdditionalParams): Promise<T[]> {
    return this.findManyBy({}, params);
  }

  async pushArray(condition: FilterQuery<T>, data: DataType): Promise<boolean> {
    try {
      // @ts-ignore
      const update = await this.Model.updateOne(condition, {
        $push: data,
        $inc: { __v: 1 },
      });
      return update.modifiedCount > 0;
    } catch {
      return false;
    }
  }

  async pullArray(condition: FilterQuery<T>, data: DataType): Promise<boolean> {
    try {
      // @ts-ignore
      const update = await this.Model.updateOne(condition, {
        $pull: data,
        $inc: { __v: 1 },
      });
      return update.modifiedCount > 0;
    } catch {
      return false;
    }
  }
}

export type AdditionalParams = {
  hiddenPropertiesToSelect?: string[];
  populate?: string[];
};
export type FilterQuery<T> = MongooseFilterQuery<T>;
export type DataType = Record<
  string,
  number | string | boolean | null | Types.ObjectId | any[]
>;

export default BaseRepository;
