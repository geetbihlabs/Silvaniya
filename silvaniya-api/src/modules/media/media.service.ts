import { Injectable } from '@nestjs/common';

@Injectable()
export class MediaService {
  async upload(file: Express.Multer.File): Promise<{ url: string }> {
    // TODO: Implement S3/R2 upload
    console.log('Uploading file:', file.originalname);
    return { url: `/uploads/${file.originalname}` };
  }
}
