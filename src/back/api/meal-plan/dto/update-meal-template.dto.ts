import { PartialType } from '@nestjs/swagger';
import { CreateMealTemplateDto, CreateMealTemplateItemDto } from './create-meal-template.dto';

export class UpdateMealTemplateItemDto extends PartialType(CreateMealTemplateItemDto) {}

export class UpdateMealTemplateDto extends PartialType(CreateMealTemplateDto) {}
