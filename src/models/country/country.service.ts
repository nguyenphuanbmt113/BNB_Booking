import {
  BadRequestException,
  Injectable,
  Param,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from 'src/common/entities/country.entity';
import { UserRole } from 'src/common/entities/role.entity';
import { Repository } from 'typeorm';
import { Roles } from '../auth/decorator/role.decorator';
import { AuthenticationGuard } from '../auth/guards/jwt-guards.guard';
import { RolesGuard } from '../auth/guards/role.guard';

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(Country)
    private readonly contryRepository: Repository<Country>,
  ) {}

  async create(createCountryDto: any) {
    const exist = await this.contryRepository.findOne({
      where: {
        name: createCountryDto.name,
      },
    });
    if (exist) throw new BadRequestException('country is exists');
    return await this.contryRepository.insert(createCountryDto);
  }

  async findAll() {
    return await this.contryRepository.find();
  }

  async findCountryByName(name: any) {
    return await this.contryRepository.findOne({
      where: {
        name: name.toString(),
      },
    });
  }

  async remove(id: number) {
    await this.contryRepository.findOneOrFail({
      where: { id },
    });
    return await this.contryRepository.delete(id);
  }
}
