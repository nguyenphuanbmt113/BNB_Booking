import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from 'src/common/entities/room.entity';
import { User } from 'src/common/entities/user.entity';
import { Repository } from 'typeorm';
import { PhotoService } from '../photo/photo.service';
import { ParallelAsync } from 'src/common/utils/async.utils';
import { DiscountService } from '../discount/discount.service';
import { DiscountType } from 'src/common/entities/discount.entity';
import {
  CustomRule,
  DetailChoice,
  RuleChoice,
} from 'src/common/entities/rule.entity';
import { AmenityGroup, AmenityItem } from 'src/common/entities/amenity.entity';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,

    private readonly photosService: PhotoService,
    private readonly discountsService: DiscountService,

    @InjectRepository(RuleChoice)
    private readonly ruleChoiceRepository: Repository<RuleChoice>,
    @InjectRepository(DetailChoice)
    private readonly detailChoiceRepository: Repository<DetailChoice>,
    @InjectRepository(CustomRule)
    private readonly customRuleRepository: Repository<CustomRule>,
    @InjectRepository(AmenityItem)
    private readonly AmenityItemRepository: Repository<AmenityItem>,
    @InjectRepository(AmenityGroup)
    private readonly AmenityGroupRepository: Repository<AmenityGroup>,
  ) {}

  async findAll(): Promise<Room[]> {
    return await this.roomRepository.find();
  }

  async findOne(id: number): Promise<Room> {
    const room = await this.roomRepository.findOneOrFail({
      where: { id },
    });
    return room;
  }

  async update(id: number, updateRoomDto: any) {
    const update = await this.roomRepository.update(id, updateRoomDto);
    return update;
  }

  remove(id: number) {
    return `This action removes a #${id} room`;
  }

  async create(host: User, createRoomDto: any): Promise<any> {
    const {
      countryId,
      photos,
      amenityItemIds,
      ruleChoices,
      customRules,
      detailChoices,
      weekDiscountRate,
      monthDiscountRate,
      ...rest
    } = createRoomDto;

    const room = (
      await this.roomRepository.insert({
        host,
        country: { id: countryId },
        amenities: amenityItemIds.map((id) => ({ id })),
        ...rest,
      })
    ).generatedMaps[0] as { id: number };

    // TODO: CHECK Whether User is Host or not

    const parallelAsync = new ParallelAsync([
      this.photosService.insertPhotos(
        photos.map((photo) => ({ ...photo, room: { id: room.id } })),
      ),
      this.discountsService.insertDiscounts([
        {
          type: DiscountType.Week,
          percent: weekDiscountRate,
          room: { id: room.id },
        },
        {
          type: DiscountType.Month,
          percent: monthDiscountRate,
          room: { id: room.id },
        },
      ]),
      this.ruleChoiceRepository.insert(
        ruleChoices.map(({ ruleId, ...rest }) => ({
          room: { id: room.id },
          rule: { id: ruleId },
          ...rest,
        })),
      ),
      this.customRuleRepository.insert(
        customRules.map((title) => ({ room: { id: room.id }, title })),
      ),
      this.detailChoiceRepository.insert(
        detailChoices.map(({ detailId, ...rest }) => ({
          detail: { id: detailId },
          ...rest,
        })),
      ),
    ]);

    await parallelAsync.done();
    return room;
  }

  async findAllAmenities(): Promise<AmenityItem[]> {
    return await this.AmenityItemRepository.find();
  }

  async createAmenityItem(createAmentityDTO: any): Promise<AmenityItem> {
    return await this.AmenityItemRepository.save(createAmentityDTO);
  }

  async createAmenityGroup(createAmenityGroupDTO: any): Promise<AmenityGroup> {
    return await this.AmenityGroupRepository.save(createAmenityGroupDTO);
  }
}
