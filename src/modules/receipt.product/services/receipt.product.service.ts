import {
    Injectable,
    NotFoundException,
    BadRequestException,
    InternalServerErrorException,
} from '@nestjs/common';
import {ReceiptProduct} from "../models/receipt.product.model";
import {ReceiptProductDTO} from "../dto/receipt.product.dto";
import {ReceiptProductRepository} from "../repositories/receipt.product.repository";

@Injectable()
export class ReceiptProductService {
    constructor(private readonly receiptProductRepository: ReceiptProductRepository) {}

    async createProduct(dto: ReceiptProductDTO): Promise<ReceiptProduct> {
        try {
            const receiptProduct = await this.receiptProductRepository.insert(dto);
            return await this.receiptProductRepository.findOneById(receiptProduct._id);
        } catch {
            throw new BadRequestException();
        }
    }

    async getAllProducts(): Promise<ReceiptProduct[]> {
        try {
            return await this.receiptProductRepository.findAll();
        } catch {
            throw new InternalServerErrorException();
        }
    }

    async deleteProduct(id: string): Promise<void> {
        const isDeleted = await this.receiptProductRepository.deleteOneBy({ _id: id });
        if (!isDeleted) {
            throw new NotFoundException();
        }
    }

    // async addProductToReceipt(receiptControlId: string, productId: string): Promise<ReceiptControl> {
    //     try {
    //         const receipt = await this.receiptControlRepo.updateOneBy(
    //             { _id: receiptControlId },
    //             { $addToSet: { products: new Types.ObjectId(productId) } }, // éviter les doublons
    //         );
    //
    //         if (!receipt) {
    //             throw new NotFoundException('ReceiptControl not found');
    //         }
    //
    //         return await this.receiptControlRepo.findOneById(receiptControlId);
    //     } catch {
    //         throw new BadRequestException('Invalid product or receipt ID');
    //     }
    // }

    // async removeProductFromReceipt(receiptControlId: string, productId: string): Promise<ReceiptControl> {
    //     try {
    //         const receipt = await this.receiptControlRepo.updateOneBy(
    //             { _id: receiptControlId },
    //             { $pull: { products: new Types.ObjectId(productId) } },
    //         );
    //
    //         if (!receipt) {
    //             throw new NotFoundException('ReceiptControl not found');
    //         }
    //
    //         return await this.receiptControlRepo.findOneById(receiptControlId);
    //     } catch {
    //         throw new BadRequestException();
    //     }
    // }
}