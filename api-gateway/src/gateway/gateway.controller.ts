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
        // use stream so we can pipe binary and preserve Content-Type from upstream
        responseType: 'stream',
      }));

      // copy headers from upstream (excluding hop-by-hop headers)
      const headers = { ...resp.headers } as Record<string, any>;
      delete headers['transfer-encoding'];
      delete headers['connection'];

      res.status(resp.status).set(headers);

      if (resp.data && typeof resp.data.pipe === 'function') {
        // stream the response directly
        resp.data.pipe(res);
      } else if (Buffer.isBuffer(resp.data)) {
        res.end(resp.data);
      } else if (typeof resp.data === 'string') {
        res.send(resp.data);
      } else if (resp.data == null) {
        res.send();
      } else {
        try {
          res.json(resp.data);
        } catch (e) {
          try {
            res.send(String(resp.data));
          } catch (e2) {
            res.status(502).send('Bad Gateway');
          }
        }
      }
    } catch (err: any) {
      const status = err.response?.status || 502;
      const data = err.response?.data || { error: 'Bad Gateway' };
      res.status(status).send(data);
    }
  }

  // Generic proxy to user_measurements service
  @All('user_measurements/*')
  async proxyUserMeasurements(@Req() req: Request, @Res() res: Response) {
    console.log('Proxying request to User Measurements service');
    console.log('Proxying request to User Measurements service');
    const base = process.env.USER_MEASUREMENTS_SERVICE_URL || 'http://user_measurements:5000';
    const forwardPath = req.url.replace(/^\/user_measurements/, '') || '/';
    const target = `${base}${forwardPath}`;

    console.log(`Proxied request to User Measurements: ${req.method} ${target}`);
    try {
      const resp = await firstValueFrom(this.http.request({
        method: req.method as any,
        url: target,
        data: req.body,
        headers: { Authorization: req.headers['authorization'] || '' },
        params: req.query,
        responseType: 'stream',
      }));

      console.log(`Received response from User Measurements: ${resp.status}`);

      const headers = { ...resp.headers } as Record<string, any>;
      delete headers['transfer-encoding'];
      delete headers['connection'];
      res.status(resp.status).set(headers);
      if (resp.data && typeof resp.data.pipe === 'function') {
        resp.data.pipe(res);
      } else if (Buffer.isBuffer(resp.data)) {
        res.end(resp.data);
      } else if (typeof resp.data === 'string') {
        res.send(resp.data);
      } else if (resp.data == null) {
        res.send();
      } else {
        try {
          res.json(resp.data);
        } catch (e) {
          try {
            res.send(String(resp.data));
          } catch (e2) {
            res.status(502).send('Bad Gateway');
          }
        }
      }
    } catch (err: any) {
      console.log('Error proxying to User Measurements service:', err.message);
      const status = err.response?.status || 502;
      const data = err.response?.data || { error: 'Bad Gateway' };
      //console.log(`User Measurements proxy error: ${status} - ${JSON.stringify(data)}`);
      res.status(status).send(undefined);
    }
  }
}