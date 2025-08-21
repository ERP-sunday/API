import { Module } from '@nestjs/common';
import { MongoModule } from 'src/common/modules/mongo.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { SupplierController } from './controllers/supplier.controller';
import { SupplierService } from './services/supplier.service';

@Module({
  imports: [MongoModule, AuthModule],
  controllers: [SupplierController],
  providers: [SupplierService],
  exports: [SupplierService],
})
export class SupplierModule {}
