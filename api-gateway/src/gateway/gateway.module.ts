import { Module } from "@nestjs/common";
import { GatewayController } from "./gateway.controller";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [HttpModule],
  controllers: [GatewayController],
  providers: [],
})
export class GatewayModule {}