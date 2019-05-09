import { Global, Module } from '@nestjs/common';
import { components } from '@nestcloud/common';
import { FeignModule } from '@nestcloud/feign';
import * as controllers from "./controllers";
import * as clients from "./clients";
import * as services from './services';
import * as filters from './filters';

@Global()
@Module({
    imports: [
        FeignModule.register(),
    ],
    providers: components(clients, services, filters),
    controllers: components(controllers)
})
export class AppModule {

}
