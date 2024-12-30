import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  Validate,
  ValidateNested,
} from 'class-validator';
import { IsAllowedKeysValidation } from '../validators/is-allowed-keys.validation';
import { IsAllowedValuesValidation } from '../validators/is-allowed-values.validation';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ListMovieSortingKeys {
  asc = 'asc',
  desc = 'desc',
}

enum ListMovieFilterOperator {
  gte = 'gte',
  lte = 'lte',
  ge = 'gt',
  le = 'lt',
  eq = 'eq',
}

class ListMovieFilterItem {
  @ApiProperty({
    type: 'string',
    examples: ['createdAt', 'name', 'minAgeRestriction'],
  })
  @IsNotEmpty()
  @IsString()
  field: string;

  @ApiProperty({
    enum: ListMovieFilterOperator,
    example: ListMovieFilterOperator.gte,
  })
  @IsEnum(ListMovieFilterOperator)
  operator: ListMovieFilterOperator;

  @ApiProperty({
    additionalProperties: {
      oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }],
    },
    example: 7,
  })
  @IsDefined()
  value: string | number | boolean;
}

export class ListMoviesDto {
  @ApiProperty({
    type: 'object',
    additionalProperties: {
      type: 'string',
      enum: Object.values(ListMovieSortingKeys),
    },
    example: { createdAt: 'desc' },
  })
  @Validate(IsAllowedKeysValidation, ['minAgeRestriction', 'name', 'createdAt'])
  @Validate(IsAllowedValuesValidation, ['desc', 'asc'])
  @IsOptional()
  sort?: Record<string, ListMovieSortingKeys>;

  @ApiProperty({
    type: [ListMovieFilterItem],
    example: { field: 'name', operator: 'eq', value: 'Movie Name' },
  })
  @ValidateNested()
  @IsOptional()
  filter?: ListMovieFilterItem[];

  @ApiPropertyOptional({
    type: 'number',
    minimum: 1,
    default: 1,
    example: 1,
  })
  @Max(1000)
  @Min(1)
  @IsNumber()
  page: number = 1;
}
