import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CountryService } from './country.service';
import { Roles } from '../auth/decorator/role.decorator';
import { UserRole } from 'src/common/entities/role.entity';
import { AuthenticationGuard } from '../auth/guards/jwt-guards.guard';
import { RolesGuard } from '../auth/guards/role.guard';

@Controller('country')
export class CountryController {
  constructor(private readonly countriesService: CountryService) {}

  @UseGuards(AuthenticationGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @Post()
  async create(@Body() createCountryDto: any): Promise<any> {
    return await this.countriesService.create(createCountryDto);
  }

  @Get()
  findAll() {
    return this.countriesService.findAll();
  }

  @UseGuards(AuthenticationGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.countriesService.remove(+id);
  }

  @Get(':name')
  findCountryByName(@Param('name') name: string) {
    return this.countriesService.findCountryByName(name);
  }
}
