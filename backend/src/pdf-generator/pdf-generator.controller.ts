import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  StreamableFile,
  Response,
  Header,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PdfGeneratorService } from './pdf-generator.service';
import { CreatePdfGeneratorDto } from './dto/create-pdf-generator.dto';
import { UpdatePdfGeneratorDto } from './dto/update-pdf-generator.dto';
import { SendNewEmailDto } from './dto/send-new-email.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { createReadStream } from 'fs';
import { join } from 'path';
import { JWTAuthGuard } from 'src/auth/utils/jwt-auth-guard';

@ApiTags('PDF generator')
@Controller('pdf-generator')
export class PdfGeneratorController {
  constructor(private readonly pdfGeneratorService: PdfGeneratorService) {}

 



  @Get('getHeaderImg/:filename')
  getProfileImg(
    @Param('filename') filename: string,
    @Response({ passthrough: true }) res,
  ): StreamableFile {
    let file;

    //check if app is in production
    // if (process.env.NODE_ENV == 'production') {

    // file = createReadStream(join(__dirname, '../static/img/' + filename));
    // } else {

    file = createReadStream(join(process.cwd(), '/../static/img/' + filename));
    // file = createReadStream(join(process.cwd(), '/static/img/' + filename));
    // }

    res.set({
      'Content-Type': 'image/png',
    });
    file.on('error', (err) => {
      console.error(err);
    });

    return new StreamableFile(file);
  }

  @Get('getImage/:filename')
  getImage(
    @Param('filename') filename: string,
    @Response({ passthrough: true }) res,
  ): StreamableFile {
    let file;

    //check if app is in production
    // if (process.env.NODE_ENV == 'production') {
    //   file = createReadStream(join(__dirname, '../static/img/' + filename));
    // } else {
    file = createReadStream(join(process.cwd(), '/../static/img/' + filename));
    // file = createReadStream(join(process.cwd(), '/static/img/' + filename));
    // }
    res.set({
      'Content-Type': 'image/png',
    });
    file.on('error', (err) => {
      console.error(err);
    });

    return new StreamableFile(file);
  }


  // @Get('/generateIPCRForm/:printType/:ipcrID')
  // @ApiQuery({ name: 'period', required: false, type: String })
  // @ApiQuery({ name: 'month', required: false, type: String })
  // async generateIPCRReport(
  //   @Res() res,
  //   @Param('printType') printType: string,
  //   @Param('ipcrID') ipcrID: number,
  //   @Query('period') period?: string,
  //   @Query('month') month?: string,
  // ): Promise<void> {
  //   let buffer;
  //   let filename;
  //   if (printType == 'TARGET') {
  //     buffer = await this.pdfGeneratorService.IPCRTarget(ipcrID);
  //   } else if (printType == 'MPOR') {
  //     buffer = await this.pdfGeneratorService.IPCRMPOR(ipcrID, +month);
  //   } else if (printType == 'SUMMARY') {
  //     buffer = await this.pdfGeneratorService.IPCRSummary(ipcrID);
  //   } else if (printType == 'IPCR') {
  //     buffer = await this.pdfGeneratorService.IPCR(ipcrID);
  //   }

  //   res.set({
  //     'Content-Type': 'application/pdf',
  //     'Content-Disposition': 'inline; filename=example.pdf',
  //     'Content-Length': buffer.length,

  //     // prevent cache
  //     'Cache-Control': 'no-cache, no-store, must-revalidate',
  //     Pragma: 'no-cache',
  //     Expires: 0,
  //   });

  //   res.end(buffer);

  //   // console.log(n)
  // }

  //   @Get('/facultyIPCR/IPCR/:id')
  // async facultyIPCR(
  //   @Res() res,
  //   @Param('id') id: string,
  // ): Promise<void> {
  //   let buffer;

  //   buffer = await this.pdfGeneratorService.facultyIPCR( +id);

  //   res.set({
  //     'Content-Type': 'application/pdf',
  //     'Content-Disposition': 'inline; filename=example.pdf',
  //     'Content-Length': buffer.length,

  //     // prevent cache
  //     'Cache-Control': 'no-cache, no-store, must-revalidate',
  //     Pragma: 'no-cache',
  //     Expires: 0,
  //   });

  //   res.end(buffer);

  //   // console.log(n)
  // }
  //     @Get('/facultyIPCR/TARGET/:id')
  //   async facultyIPCRTarget(
  //   @Res() res,
  //   @Param('id') id: string,
  // ): Promise<void> {
  //   let buffer;

  //   buffer = await this.pdfGeneratorService.facultyIPCRTarget( +id);

  //   res.set({
  //     'Content-Type': 'application/pdf',
  //     'Content-Disposition': 'inline; filename=example.pdf',
  //     'Content-Length': buffer.length,

  //     // prevent cache
  //     'Cache-Control': 'no-cache, no-store, must-revalidate',
  //     Pragma: 'no-cache',
  //     Expires: 0,
  //   });

  //   res.end(buffer);

  //   // console.log(n)
  // }

}
