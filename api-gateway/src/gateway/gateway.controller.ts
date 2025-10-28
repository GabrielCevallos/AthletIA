import { HttpService } from "@nestjs/axios";
import { Controller, Get, All, Req, Res } from "@nestjs/common";
import type { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { createTargetUri } from "./gateway.scripts";

@Controller()
export class GatewayController {
  constructor(private readonly http: HttpService) { }

  @Get("health")
  healthCheck() {
    return { status: "OK" };
  }

  // Generic proxy to AthletIA service. Forward any method and path under /athletia/*
  // Use named wildcard to satisfy path-to-regexp v6 (avoid LegacyRouteConverter warning)
  @All(['athletia', 'athletia/*path'])
  async proxyAthletia(@Req() req: Request, @Res() res: Response) {
    const base = process.env.ATHLETIA_SERVICE_URL || 'http://athletia:3000';
    const target = createTargetUri(req, base, /^\/athletia/);

    try {
      const resp = await firstValueFrom(this.http.request({
        method: req.method as any,
        url: target,
        data: req.body,
        headers: { Authorization: req.headers['authorization'] || '' },
        params: req.query,
      }));

      // copy headers from upstream (excluding hop-by-hop headers)
      const headers = { ...resp.headers } as Record<string, any>;
      delete headers['transfer-encoding'];
      delete headers['connection'];

      res.status(resp.status).set(headers);
      res.json(resp.data);

    } catch (err: any) {
      const status = err.response?.status || 502;
      const data = err.response?.data || { error: 'Bad Gateway' };
      res.status(status).send(data);
    }
  }

  // Generic proxy to user_measurements service
  // Use named wildcard to avoid legacy path conversion warnings
  @All(['user_measurements', 'user_measurements/*path'])
  async proxyUserMeasurements(@Req() req: Request, @Res() res: Response) {
    const base = process.env.USER_MEASUREMENTS_SERVICE_URL || 'http://user_measurements:5000';
    const target = createTargetUri(req, base, /^\/user_measurements/);
    console.log(`Target uri: ${target}`);

    try {
      const resp = await firstValueFrom(this.http.request({
        method: req.method as any,
        url: target,
        data: req.body,
        headers: { Authorization: req.headers['authorization'] || '' },
        params: req.query,
      }));

      console.log(`Received response from User Measurements: ${resp.status}`);

      const headers = { ...resp.headers } as Record<string, any>;
      delete headers['transfer-encoding'];
      delete headers['connection'];
      res.status(resp.status).set(headers);
      res.json(resp.data);

    } catch (err: any) {
      console.log('Error proxying to User Measurements service:', err.message);
      const status = err.response?.status || 502;
      const data = err.response?.data;
      res.status(status).send(data);
    }
  }
}