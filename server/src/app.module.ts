import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SwaggerModule } from '@nestjs/swagger';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true
  }),
  MongooseModule.forRootAsync({
    useFactory: async (configService: ConfigService) => ({
      uri: `mongodb+srv://${encodeURIComponent(configService.get<string>('MONGO_USERNAME'))}:${encodeURIComponent(configService.get<string>('MONGO_PASSWORD'))}@${configService.get<string>('MONGO_URI')}`,
    }),
    inject: [ConfigService],
  }),
    SwaggerModule,
  EventEmitterModule.forRoot(),
  UserModule,
  AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
