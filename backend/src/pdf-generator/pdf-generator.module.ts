import { Module } from '@nestjs/common';
import { PdfGeneratorService } from './pdf-generator.service';
import { PdfGeneratorController } from './pdf-generator.controller';

import { MailService } from 'src/mail/mail.service';


@Module({
  imports: [],
  controllers: [PdfGeneratorController],
  providers: [PdfGeneratorService, MailService, ],
})
export class PdfGeneratorModule {}
