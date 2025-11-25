import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
/* import { EventEmitterModule } from "@nestjs/event-emitter";
import { ThrottlerModule } from "@nestjs/throttler"; */
import { Notification } from "./entity/notification.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres", // your pgAdmin username
      password: "root", // your pgAdmin password
      database: "nestjs_notification", // the database you created
      autoLoadEntities: true,
      synchronize: true, // only for development
      entities: [Notification],
    }),
    /*  ConfigModule.forRoot({
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
