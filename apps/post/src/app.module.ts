import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
/* import { ConfigModule } from "@nestjs/config"; */
/* import { EventEmitterModule } from "@nestjs/event-emitter";
import { ThrottlerModule } from "@nestjs/throttler"; */
import { CacheModule } from "@nestjs/cache-manager";
/* import { EventsModule } from "apps/events/events.module"; */
import { JwtModule } from "@nestjs/jwt";
import { Posts } from "./entity/post.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "root",
      database: "nestjs_post",
      autoLoadEntities: true,
      entities: [Posts],
      synchronize: true,
    }),
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
    CacheModule.register({
      isGlobal: true,
      ttl: 30000,
      max: 100,
    }),
    /* EventsModule, */
    JwtModule.register({ global: true }),
  ],
})
export class AppModule {}
