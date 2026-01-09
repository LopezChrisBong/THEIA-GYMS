import { PartialType } from '@nestjs/swagger';
import { CreatePdfGeneratorDto } from './create-pdf-generator.dto';

export class UpdatePdfGeneratorDto extends PartialType(CreatePdfGeneratorDto) {}
