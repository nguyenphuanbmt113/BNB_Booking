import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from 'src/common/entities/country.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(Country)
    private readonly contryRepository: Repository<Country>,
  ) {}

  async create(createCountryDto: any) {
    const exist = await this.contryRepository.findOne(createCountryDto);
    if (exist) throw new BadRequestException('country is exists');
    return await this.contryRepository.insert(createCountryDto);
  }

  async findAll() {
    return await this.contryRepository.find();
  }

  async remove(id: number) {
    await this.contryRepository.findOneOrFail({
      where: { id },
    });
    return await this.contryRepository.delete(id);
  }
}
