import { PartialType } from '@nestjs/swagger';
import { CreateShoppingListDto, CreateShoppingListItemDto } from './create-shopping-list.dto';

export class UpdateShoppingListItemDto extends PartialType(CreateShoppingListItemDto) {}

export class UpdateShoppingListDto extends PartialType(CreateShoppingListDto) {}
