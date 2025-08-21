import {
  Document,
  FilterQuery as MongooseFilterQuery,
  Model,
  Types,
  UpdateQuery,
} from 'mongoose';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class BaseRepository<T extends Document> {
  private readonly logger = new Logger(BaseRepository.name);

  constructor(protected readonly model: Model<T>) {}

  private transform(doc: T | (Document & { toObject: () => any })): T {
    return doc.toObject({ versionKey: false }) as T;
  }

  async insertMany(data: Partial<T>[]): Promise<T[]> {
    try {
      const docs = await this.model.insertMany(data);
      return docs.map((doc) => doc.toObject({ versionKey: false }) as T);
    } catch (error) {
      this.handleError('insertMany', error);
    }
  }

  async insert(data: Partial<T>): Promise<T> {
    try {
      const doc = new this.model(data);
      await doc.validate();
      const saved = await doc.save();
      return this.transform(saved);
    } catch (error) {
      this.handleError('insert', error);
    }
  }

  async findOneBy(
    condition: FilterQuery<T>,
    params?: AdditionalParams,
  ): Promise<T> {
    try {
      const doc = await this.model
        .findOne(condition)
        .select(this.buildSelectString(params?.hiddenPropertiesToSelect))
        .populate(params?.populate || []);
      if (!doc) throw new NotFoundException('Document not found');
      return this.transform(doc);
    } catch (error) {
      this.handleError('findOneBy', error);
    }
  }

  async findOptionalBy(
    condition: FilterQuery<T>,
    params?: AdditionalParams,
  ): Promise<T | null> {
    try {
      const doc = await this.model
        .findOne(condition)
        .select(this.buildSelectString(params?.hiddenPropertiesToSelect))
        .populate(params?.populate || []);
      return doc ? this.transform(doc) : null;
    } catch (error) {
      this.handleError('findOptionalBy', error);
    }
  }

  async findOneById(_id: string, params?: AdditionalParams): Promise<T> {
    if (!Types.ObjectId.isValid(_id)) {
      throw new BadRequestException(`Invalid ObjectId format: ${_id}`);
    }
    return this.findOneBy(
      { _id: new Types.ObjectId(_id) } as FilterQuery<T>,
      params,
    );
  }

  async deleteOneBy(condition: FilterQuery<T>): Promise<boolean> {
    try {
      const { deletedCount } = await this.model.deleteOne(condition);
      return deletedCount > 0;
    } catch (error) {
      this.handleError('deleteOneBy', error);
    }
  }

  async updateOneBy(
    condition: FilterQuery<T>,
    set: Partial<T>,
  ): Promise<boolean> {
    try {
      const { modifiedCount } = await this.model.updateOne(condition, {
        $set: set,
        $inc: { __v: 1 },
      } as UpdateQuery<T>);
      return modifiedCount > 0;
    } catch (error) {
      this.handleError('updateOneBy', error);
    }
  }

  async findManyBy(
    condition: FilterQuery<T>,
    params?: AdditionalParams,
  ): Promise<T[]> {
    try {
      const docs = await this.model
        .find(condition)
        .select(this.buildSelectString(params?.hiddenPropertiesToSelect))
        .populate(params?.populate || []);
      return docs.map(this.transform);
    } catch (error) {
      this.handleError('findManyBy', error);
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
      const { modifiedCount } = await this.model.updateOne(condition, {
        $push: data,
        $inc: { __v: 1 },
      } as UpdateQuery<T>);
      return modifiedCount > 0;
    } catch (error) {
      this.handleError('pushArray', error);
    }
  }

  async pullArray(
    condition: FilterQuery<T>,
    data: Partial<T>,
  ): Promise<boolean> {
    try {
      const { modifiedCount } = await this.model.updateOne(condition, {
        $pull: data,
        $inc: { __v: 1 },
      } as UpdateQuery<T>);
      return modifiedCount > 0;
    } catch (error) {
      this.handleError('pullArray', error);
    }
  }

  private buildSelectString(fields: string[] = []): string {
    return fields.map((field) => `+${field}`).join(' ');
  }

  private handleError(method: string, error: any): never {
    this.logger.error(`[${method}]`, error);

    if (error.name === 'ValidationError') {
      throw new BadRequestException(error.message);
    }

    if (error.code === 11000) {
      throw new ConflictException('Duplicate key error');
    }

    if (error instanceof NotFoundException) {
      throw error;
    }

    throw new InternalServerErrorException(`Unexpected error in ${method}`);
  }
}

// Types
export type AdditionalParams = {
  hiddenPropertiesToSelect?: string[];
  populate?: { path: string; select?: string }[] | string[];
};
export type FilterQuery<T> = MongooseFilterQuery<T>;
