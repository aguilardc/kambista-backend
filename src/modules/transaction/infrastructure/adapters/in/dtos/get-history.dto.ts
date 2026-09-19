import { IsDateString, IsOptional, IsString } from 'class-validator';

export class GetHistoryDto {
  @IsDateString({}, { message: 'startDate debe ser una fecha válida (ISO 8601)' })
  startDate: string;

  @IsDateString({}, { message: 'endDate debe ser una fecha válida (ISO 8601)' })
  endDate: string;

  @IsOptional()
  @IsString()
  userId?: string;
}
