import { HttpService } from "@nestjs/axios";
import { Controller, Get, All, Req, Res } from "@nestjs/common";
import type { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';

@Controller()
export class GatewayController {
  constructor(private readonly http: HttpService) {}

  @Get("health")
  healthCheck() {
    return { status: "OK" };
  }

  // Generic proxy to AthletIA service. Forward any method and path under /athletia/*
  @All('athletia/*')
  async proxyAthletia(@Req() req: Request, @Res() res: Response) {
    const base = process.env.ATHLETIA_SERVICE_URL || 'http://athletia:3000';
    const forwardPath = req.url.replace(/^\/athletia/, '') || '/';
    const target = `${base}${forwardPath}`;

    try {
      const resp = await firstValueFrom(this.http.request({
        method: req.method as any,
        url: target,
        data: req.body,
        headers: { Authorization: req.headers['authorization'] || '' },
        params: req.query,
        responseType: 'arraybuffer',
      }));

      res.status(resp.status).set(resp.headers).send(resp.data);
    } catch (err: any) {
      const status = err.response?.status || 502;
      const data = err.response?.data || { error: 'Bad Gateway' };
      res.status(status).send(data);
    }
  }

  // Generic proxy to user_measurements service
  @All('user_measurements/*')
  async proxyUserMeasurements(@Req() req: Request, @Res() res: Response) {
    const base = process.env.USER_MEASUREMENTS_SERVICE_URL || 'http://user_measurements:5000';
    const forwardPath = req.url.replace(/^\/user_measurements/, '') || '/';
    const target = `${base}${forwardPath}`;

    try {
      const resp = await firstValueFrom(this.http.request({
        method: req.method as any,
        url: target,
        data: req.body,
        headers: { Authorization: req.headers['authorization'] || '' },
        params: req.query,
        responseType: 'arraybuffer',
      }));

      res.status(resp.status).set(resp.headers).send(resp.data);
    } catch (err: any) {
      const status = err.response?.status || 502;
      const data = err.response?.data || { error: 'Bad Gateway' };
      res.status(status).send(data);
    }
  }
}