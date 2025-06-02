import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SupplierDTO } from '../dto/supplier.dto';
import { Supplier } from '../models/supplier.model';
import { SupplierRepository } from '../repositories/supplier.repository';

@Injectable()
export class SupplierService {
  constructor(private readonly supplierRepository: SupplierRepository) {}

  async getAllSuppliers(): Promise<Supplier[]> {
    try {
      return await this.supplierRepository.findAll();
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async getSupplierById(id: string): Promise<Supplier> {
    try {
      const supplier = await this.supplierRepository.findOneById(id);
      if (!supplier) throw new NotFoundException();
      return supplier;
    } catch {
      throw new NotFoundException();
    }
  }

  async createSupplier(dto: SupplierDTO): Promise<Supplier> {
    try {
      const supplier = await this.supplierRepository.insert(dto);
      return await this.supplierRepository.findOneById(
        (supplier as any)._id.toString(),
      );
    } catch {
      throw new BadRequestException();
    }
  }

  async updateSupplier(id: string, dto: SupplierDTO): Promise<Supplier> {
    const isUpdated = await this.supplierRepository.updateOneBy(
      { _id: id },
      dto,
    );
    if (!isUpdated) {
      throw new NotFoundException();
    }
    return await this.getSupplierById(id);
  }

  async deleteSupplier(id: string): Promise<void> {
    const isDeleted = await this.supplierRepository.deleteOneBy({ _id: id });
    if (!isDeleted) {
      throw new NotFoundException();
    }
  }
}
