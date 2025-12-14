import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsArray, IsEnum, IsString } from 'class-validator';

export class DuplicateMealsDto {
  @ApiProperty({ description: 'Date source à dupliquer (ISO 8601)', example: '2025-01-15T00:00:00.000Z' })
  @IsDateString()
  sourceDate: string;

  @ApiProperty({
    description: 'Dates cibles où dupliquer les repas (ISO 8601)',
    type: [String],
    example: ['2025-01-16T00:00:00.000Z', '2025-01-17T00:00:00.000Z']
  })
  @IsArray()
  @IsDateString({}, { each: true })
  targetDates: string[];

  @ApiProperty({
    description: 'Mode de gestion des conflits',
    enum: ['skip', 'replace'],
    default: 'skip',
    example: 'skip'
  })
  @IsEnum(['skip', 'replace'])
  conflictMode: 'skip' | 'replace';
}

export class ApplyTemplateDto {
  @ApiProperty({ description: 'ID du template à appliquer' })
  @IsString()
  templateId: string;

  @ApiProperty({
    description: 'Dates cibles où appliquer le template (ISO 8601)',
    type: [String],
    example: ['2025-01-15T00:00:00.000Z', '2025-01-16T00:00:00.000Z']
  })
  @IsArray()
  @IsDateString({}, { each: true })
  targetDates: string[];

  @ApiProperty({
    description: 'Mode de gestion des conflits',
    enum: ['skip', 'replace'],
    default: 'skip',
    example: 'skip'
  })
  @IsEnum(['skip', 'replace'])
  conflictMode: 'skip' | 'replace';
}
