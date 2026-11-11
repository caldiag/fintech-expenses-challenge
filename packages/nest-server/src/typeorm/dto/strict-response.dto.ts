import { InternalServerErrorException } from '@nestjs/common';
import { plainToInstance, type ClassConstructor } from 'class-transformer';
import { validateSync } from 'class-validator';

export function toStrictResponseDto<T extends object>(
  dtoClass: ClassConstructor<T>,
  value: unknown,
): T {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new InternalServerErrorException(
      `Response does not match ${dtoClass.name}`,
    );
  }

  const dto = plainToInstance(dtoClass, omitUndefined(value));
  const errors = validateSync(dto, {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: true,
  });

  if (errors.length > 0) {
    throw new InternalServerErrorException(
      `Response does not match ${dtoClass.name}`,
    );
  }

  return dto;
}

export function toStrictResponseDtoArray<T extends object>(
  dtoClass: ClassConstructor<T>,
  values: unknown,
): T[] {
  if (!Array.isArray(values)) {
    throw new InternalServerErrorException(
      `Response does not match ${dtoClass.name}[]`,
    );
  }

  return values.map((value) => toStrictResponseDto(dtoClass, value));
}

function omitUndefined(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(omitUndefined);
  if (value instanceof Date || value === null || typeof value !== 'object') {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value).flatMap(([key, property]) =>
      property === undefined ? [] : [[key, omitUndefined(property)]],
    ),
  );
}
