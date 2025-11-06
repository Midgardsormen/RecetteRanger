import { ApiProperty } from '@nestjs/swagger';

class StepDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  stepNumber: number;

  @ApiProperty()
  description: string;
}

class RecipeIngredientDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  ingredientId: string;

  @ApiProperty({ nullable: true })
  quantity: number | null;

  @ApiProperty({ nullable: true })
  unit: string | null;

  @ApiProperty({ nullable: true })
  note: string | null;
}

export class RecipeDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  label: string;

  @ApiProperty({ nullable: true })
  imageUrl: string | null;

  @ApiProperty({ nullable: true })
  description: string | null;

  @ApiProperty()
  prepMinutes: number;

  @ApiProperty()
  cookMinutes: number;

  @ApiProperty()
  restMinutes: number;

  @ApiProperty({ type: [String], default: [] })
  materiel: string[];

  @ApiProperty({ type: [String], default: [] })
  appareils: string[];

  @ApiProperty()
  ownerId: string;

  @ApiProperty({ enum: ['PRIVATE', 'SHARED', 'PUBLIC'] })
  visibility: string;

  @ApiProperty({ type: [StepDto] })
  steps: StepDto[];

  @ApiProperty({ type: [RecipeIngredientDto] })
  ingredients: RecipeIngredientDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
