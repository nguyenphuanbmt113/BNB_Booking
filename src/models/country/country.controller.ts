import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Public } from '../auth/decorator/public.decorator';
import { CountryService } from './country.service';

@Controller('country')
export class CountryController {
  constructor(private readonly countriesService: CountryService) {}

  @Public()
  @Post()
  async create(@Body() createCountryDto: any): Promise<any> {
    return await this.countriesService.create(createCountryDto);
  }

  @Get()
  findAll() {
    return this.countriesService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.countriesService.remove(+id);
  }
}
