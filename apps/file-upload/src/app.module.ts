import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { File } from "./entity/cloudinary.entity";
import { JwtModule } from "@nestjs/jwt";
/* import { ConfigModule } from "@nestjs/config";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { ThrottlerModule } from "@nestjs/throttler"; */

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres", // your pgAdmin username
      password: "root", // your pgAdmin password
      database: "nestjs_fileUpload", // the database you created
      autoLoadEntities: true,
      synchronize: true, // only for development
      entities: [File],
    }),
    JwtModule.register({ global: true }),
    /* ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }), */
    /* EventEmitterModule.forRoot({
      global: true,
      wildcard: false,
      maxListeners: 20,
      verboseMemoryLeak: true,
    }), */
    /* ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 5,
        },
      ],
    }), */
  ],
})
export class AppModule {}
