import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Photo } from 'src/common/entities/photo.entity';
import { ObjectLiteral, Repository } from 'typeorm';

@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,
  ) {}

  async insertPhotos(photos: any[]): Promise<ObjectLiteral[]> {
    return (await this.photoRepository.insert(photos)).identifiers;
  }
}
