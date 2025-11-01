import { PartialType } from '@nestjs/swagger';
import { CreateMealPlanDayDto, CreateMealPlanItemDto } from './create-meal-plan.dto';

export class UpdateMealPlanItemDto extends PartialType(CreateMealPlanItemDto) {}

export class UpdateMealPlanDayDto extends PartialType(CreateMealPlanDayDto) {}
