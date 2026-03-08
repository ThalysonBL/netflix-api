import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../prisma/prisma.service';
import { DuplicateUserFieldError } from '../../errors/duplicate-user-field.error';
import type { DuplicateUserField } from '../../errors/duplicate-user-field.error';
import { UserRepository, CreateUserData } from '../user.repository';

function getDuplicateField(meta: unknown): DuplicateUserField | null {
  const m = meta as Record<string, unknown> | undefined;
  const target = (m?.target as string[])?.[0];
  if (target === 'cpf' || target === 'email') return target;
  const cause = (m?.driverAdapterError as Record<string, unknown>)?.cause as Record<string, unknown> | undefined;
  const constraint = m?.constraint ?? cause?.constraint;
  const index = typeof constraint === 'string' ? constraint : (constraint as { index?: string })?.index ?? '';
  if (String(index).toLowerCase().includes('cpf')) return 'cpf';
  if (String(index).toLowerCase().includes('email')) return 'email';
  return null;
}

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserData) {
    try {
      return await this.prisma.user.create({
        data: {
          ...data,
          birth_date: new Date(data.birth_date),
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const field = getDuplicateField(error.meta);
        if (field) {
          throw new DuplicateUserFieldError(field);
        }
      }
      throw error;
    }
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findByCpf(cpf: string) {
    return this.prisma.user.findUnique({
      where: { cpf },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }
}
