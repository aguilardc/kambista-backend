import {
  IsString,
  IsNumber,
  IsPositive,
  IsIn,
  IsNotEmpty,
} from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['USD', 'PEN'], { message: 'La moneda de origen debe ser USD o PEN' })
  monedaOrigen: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['USD', 'PEN'], { message: 'La moneda de destino debe ser USD o PEN' })
  monedaDestino: string;

  @IsNumber()
  @IsPositive({ message: 'El monto debe ser mayor a cero' })
  monto: number;
}
