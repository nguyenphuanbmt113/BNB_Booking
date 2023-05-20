import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Discount } from 'src/common/entities/discount.entity';
import { ObjectLiteral, Repository } from 'typeorm';

@Injectable()
export class DiscountService {
  constructor(
    @InjectRepository(Discount)
    private readonly discountsRepository: Repository<Discount>,
  ) {}

  async insertDiscounts(discounts: any[]): Promise<ObjectLiteral[]> {
    return (await this.discountsRepository.insert(discounts)).identifiers;
  }
}
