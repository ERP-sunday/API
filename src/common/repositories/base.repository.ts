import {
  Document,
  FilterQuery as MongooseFilterQuery,
  Model,
  UpdateQuery,
} from 'mongoose';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class BaseRepository<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  async insert(data: Partial<T>): Promise<T> {
    try {
      const newObject = new this.model(data);
      await newObject.validate();
      const insertedObject = await newObject.save();
      return insertedObject.toObject({ versionKey: false });
    } catch (error) {
      console.error('Error inserting document:', error);
      throw new BadRequestException('Failed to insert document');
    }
  }

  async findOneBy(
    condition: FilterQuery<T>,
    params?: AdditionalParams,
  ): Promise<T | null> {
    try {
      const foundObject = await this.model
        .findOne(condition)
        .select(this.buildSelectString(params?.hiddenPropertiesToSelect))
        .populate(params?.populate || []);

      if (!foundObject) {
        throw new NotFoundException('Document not found');
      }

      return foundObject.toObject({ versionKey: false });
    } catch (error) {
      console.error('Error finding document:', error);
      throw new BadRequestException('Failed to find document');
    }
  }

  async findOneById(_id: string, params?: AdditionalParams): Promise<T | null> {
    return this.findOneBy({ _id } as FilterQuery<T>, params);
  }

  async deleteOneBy(condition: FilterQuery<T>): Promise<boolean> {
    try {
      const result = await this.model.deleteOne(condition);
      return result.deletedCount > 0;
    } catch (error) {
      console.error('Error deleting document:', error);
      throw new BadRequestException('Failed to delete document');
    }
  }

  async updateOneBy(
    condition: FilterQuery<T>,
    set: Partial<T>,
  ): Promise<boolean> {
    try {
      const update = await this.model.updateOne(condition, {
        $set: set,
        $inc: { __v: 1 },
      } as UpdateQuery<T>);
      return update.modifiedCount > 0;
    } catch (error) {
      console.error('Error updating document:', error);
      throw new BadRequestException('Failed to update document');
    }
  }

  async findManyBy(
    condition: FilterQuery<T>,
    params?: AdditionalParams,
  ): Promise<T[]> {
    try {
      const foundObjects = await this.model
        .find(condition)
        .select(this.buildSelectString(params?.hiddenPropertiesToSelect))
        .populate(params?.populate || []);

      return foundObjects.map((obj) => obj.toObject({ versionKey: false }));
    } catch (error) {
      console.error('Error finding documents:', error);
      throw new BadRequestException('Failed to find documents');
    }
  }

  async findAll(params?: AdditionalParams): Promise<T[]> {
    return this.findManyBy({}, params);
  }

  async pushArray(
    condition: FilterQuery<T>,
    data: Partial<T>,
  ): Promise<boolean> {
    try {
      const update = await this.model.updateOne(condition, {
        $push: data,
        $inc: { __v: 1 },
      } as UpdateQuery<T>);
      return update.modifiedCount > 0;
    } catch (error) {
      console.error('Error pushing to array:', error);
      throw new BadRequestException('Failed to push to array');
    }
  }

  async pullArray(
    condition: FilterQuery<T>,
    data: Partial<T>,
  ): Promise<boolean> {
    try {
      const update = await this.model.updateOne(condition, {
        $pull: data,
        $inc: { __v: 1 },
      } as UpdateQuery<T>);
      return update.modifiedCount > 0;
    } catch (error) {
      console.error('Error pulling from array:', error);
      throw new BadRequestException('Failed to pull from array');
    }
  }

  private buildSelectString(fields: string[] = []): string {
    return fields.map((field) => `+${field}`).join(' ');
  }
}

// Types pour la configuration des requêtes
export type AdditionalParams = {
  hiddenPropertiesToSelect?: string[];
  populate?: string[];
};
export type FilterQuery<T> = MongooseFilterQuery<T>;
