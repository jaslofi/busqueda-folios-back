// src/file/file.controller.ts
import { Controller, Get, Query, Res, HttpException, HttpStatus, NotFoundException, Param } from '@nestjs/common';
import { FileService } from './file.service';
import { Response } from 'express';
import * as path from 'path';
import { NetworkService } from 'src/network/network.service';

@Controller('files')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly networkService: NetworkService,
  ) {}

  @Get()
  async getFiles(
    @Query('search') search: string,
    @Query('exactMatch') exactMatch: boolean
  ) {
    try {
      return await this.fileService.getFiles(search || '', exactMatch);
    } catch (error) {
      throw new HttpException('Error al buscar comprobantes', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('download')
  async download(@Query('filename') filename: string, @Res() res: Response) {
    try {
      const filePath = path.join(this.networkService.getBasePath(), filename);
      
      if (!await this.networkService.fileExists(filePath)) {
        throw new NotFoundException('Archivo no encontrado');
      }

      const fileSize = (await this.networkService.getFileStats(filePath)).size;
      const fileStream = this.networkService.createReadStream(filePath);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': fileSize,
        'Content-Disposition': `inline; filename="${encodeURIComponent(filename)}"`,
        'Cache-Control': 'no-cache',
        'Access-Control-Expose-Headers': 'Content-Disposition, Content-Length'
      });

      fileStream.pipe(res);
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al descargar el archivo',
        error.status || HttpStatus.NOT_FOUND
      );
    }
  }

  @Get('download-multiple')
  async downloadMultiple(@Query('filenames') filenames: string, @Res() res: Response) {
    try {
      const list = filenames.split(',');
      await this.fileService.zipFiles(list, res);
    } catch (error) {
      throw new HttpException('Error al generar el archivo ZIP', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  @Get('preview/:filename')
  async previewFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = path.join(this.networkService.getBasePath(), filename);

    if (!await this.networkService.fileExists(filePath)) {
      throw new NotFoundException('Archivo no encontrado');
    }

    res.setHeader('Content-Type', 'application/pdf');
    const stream = this.networkService.createReadStream(filePath);
    stream.pipe(res);
  }
}