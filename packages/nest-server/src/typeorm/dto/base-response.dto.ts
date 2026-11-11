import { IsDate, IsOptional, IsUUID } from 'class-validator';

export class BaseResponseDTO {
  @IsUUID('4')
  id: string;

  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  updatedAt?: Date;

  @IsOptional()
  @IsDate()
  deletedAt?: Date | null;
}
