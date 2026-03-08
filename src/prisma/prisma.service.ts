import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const url = process.env.DATABASE_URL;
    if (!url?.trim()) {
      throw new Error('DATABASE_URL must be set in .env to connect to MySQL.');
    }
    const adapter = new PrismaMariaDb(url);
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
