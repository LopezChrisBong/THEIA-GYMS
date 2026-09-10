import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsInt,
  IsEnum,
  IsNumber,
  MaxLength,
} from 'class-validator';
import { GoldType, JewelryItemStatus } from '../entities/jewelry-item.entity';

export class BulkImportJewelryItemDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  itemCode: string;

  @IsInt()
  @IsOptional()
  categoryId?: number;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  categoryName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  color?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  material?: string;

  @IsInt()
  @IsOptional()
  stoneTypeId?: number;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  stoneTypeName?: string;

  @IsInt()
  @IsOptional()
  jewelryTypeId?: number;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  jewelryTypeName?: string;

  @IsEnum(GoldType)
  @IsOptional()
  goldType?: GoldType;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  carat?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  karat?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  size?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  bandWidth?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsEnum(JewelryItemStatus)
  @IsOptional()
  status?: JewelryItemStatus;

  @IsInt()
  @IsNotEmpty()
  branchId: number;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  barcode?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsOptional()
  addedBy?: number;
}
