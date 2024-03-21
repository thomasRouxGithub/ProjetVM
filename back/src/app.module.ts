import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path'; // Importer la fonction join de path

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [join(__dirname, 'models', '**', '*.entity{.ts,.js}')], // Utiliser join pour obtenir le chemin absolu
      synchronize: true,
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
