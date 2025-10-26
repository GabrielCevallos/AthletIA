import { HttpService } from "@nestjs/axios";
import { Controller, Get } from "@nestjs/common";

@Controller()
export class GatewayController {
  constructor(private readonly http: HttpService) {}

  @Get("health")
  healthCheck() {
    return { status: "OK" };
  }
}