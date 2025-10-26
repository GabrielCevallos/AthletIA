import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class StatisticsService {
  private baseUrl: string;

  constructor(private http: HttpService, private config: ConfigService) {
    this.baseUrl = this.config.get<string>('STATISTICS_MICROSERVICE_URL') || 'http://localhost:5000';
  }

  async findAll(query?: Record<string, any>, jwtToken?: string) {
    try {
      const resp = (await firstValueFrom(
        this.http.get(
          `${this.baseUrl}/statistics`,
          { 
            params: query,
            headers: {
              Authorization: `Bearer ${jwtToken}`
            }
          }
        )
      )) as any;
      return resp.data;
    } catch (err: any) {
      throw new HttpException(err.response?.data || 'Error fetching statistics', err.response?.status || HttpStatus.BAD_GATEWAY);
    }
  }

  async findOne(id: string, jwtToken?: string) {
    try {
      const resp = (await firstValueFrom(
        this.http.get(`${this.baseUrl}/statistics/${id}`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`
          }
        })
      )) as any;
      return resp.data;
    } catch (err: any) {
      throw new HttpException(err.response?.data || 'Error fetching statistic', err.response?.status || HttpStatus.BAD_GATEWAY);
    }
  }

  async create(payload: any, jwtToken?: string) {
    try {
      const resp = (await firstValueFrom(
        this.http.post(`${this.baseUrl}/statistics`, payload, {
          headers: {
            Authorization: `Bearer ${jwtToken}`
          }
        })
      )) as any;
      return resp.data;
    } catch (err: any) {
      throw new HttpException(err.response?.data || 'Error creating statistic', err.response?.status || HttpStatus.BAD_GATEWAY);
    }
  }

  async remove(id: string, jwtToken?: string) {
    try {
      const resp = (await firstValueFrom(
        this.http.delete(`${this.baseUrl}/statistics/${id}`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`
          }
        })
      )) as any;
      return resp.data;
    } catch (err: any) {
      throw new HttpException(err.response?.data || 'Error deleting statistic', err.response?.status || HttpStatus.BAD_GATEWAY);
    }
  }
}
