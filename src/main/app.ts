import { AppModule } from "./app.module";
import { NestFactory } from "@nestjs/core";
import { NestCloud } from '@nestcloud/core';
import { INestApplication } from "@nestjs/common";

export async function bootstrap(cb?: (app: INestApplication) => void) {
    const app = NestCloud.create(await NestFactory.create(AppModule, {}));
    if (typeof cb === 'function') {
        cb(app);
    }
    await app.listen(56562);
}
