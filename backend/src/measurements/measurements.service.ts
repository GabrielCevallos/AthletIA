import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Measurement } from './measurements.entity';
import { MeasurementRequest, MeasurementUpdate } from './dto/measurements.dto';
import { CheckTime } from './enum/check-time.enum';

@Injectable()
export class MeasurementsService {
  constructor(
    @InjectRepository(Measurement)
    private measurementRepository: Repository<Measurement>,
  ) {}

  async create(measurementDto: MeasurementRequest): Promise<Measurement> {
      const { weight, height } = measurementDto;
      const imc = this.calculateIMC(weight, height);
      const newMeasurement = this.measurementRepository.create({
        ...measurementDto,
        checkTime: measurementDto.checkTime as CheckTime,
        imc,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return this.measurementRepository.save(newMeasurement);
  }

  async findAll(): Promise<Measurement[]> {
    return await this.measurementRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Measurement> {
    const measurement = await this.measurementRepository.findOne({ where: { id } });
    if (!measurement) {
      throw new Error(`Measurement with ID ${id} not found`);
    }
    return measurement;
  }

  async update(id: string, measurementDto: MeasurementUpdate): Promise<Measurement> {
    const measurement = await this.findOne(id);
    
    // Recalcular IMC si weight o height cambian
    if (measurementDto.weight || measurementDto.height) {
      const weight = measurementDto.weight ?? measurement.weight;
      const height = measurementDto.height ?? measurement.height;
      measurementDto['imc'] = this.calculateIMC(weight, height);
    }
    
    Object.assign(measurement, measurementDto, { updatedAt: new Date() });
    return await this.measurementRepository.save(measurement);
  }

  /**
   * Upsert the measurement for a given account.
   * If the account has no measurement yet, create it on first edit.
   */
  async editForAccount(
    accountId: string,
    dto: MeasurementUpdate,
  ): Promise<Measurement> {
    // Try to find existing measurement by account
    const existing = await this.measurementRepository.findOne({
      where: { account: { id: accountId } },
      
    });

    if (existing) {
      // Recalculate IMC when weight/height change
      if (dto.weight || dto.height) {
        const weight = dto.weight ?? existing.weight;
        const height = dto.height ?? existing.height;
        dto['imc'] = this.calculateIMC(weight, height);
      }
      Object.assign(existing, dto);
      return this.measurementRepository.save(existing);
    }

    // No existing measurement: create on-demand (first edit).
    const { weight, height } = dto as { weight: number; height: number };
    const imc = this.calculateIMC(weight, height);
    const payload: Partial<Measurement> = {
      ...dto,
      checkTime: dto.checkTime as CheckTime,
      imc,
      account: { id: accountId } as any,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const newMeasurement = this.measurementRepository.create(payload);
    return this.measurementRepository.save(newMeasurement);
  }

  async findByAccountId(accountId: string): Promise<Measurement | null> {
    return this.measurementRepository.findOne({
      where: { account: { id: accountId } },
      
    });
  }

  async remove(id: string): Promise<void> {
    const measurement = await this.findOne(id);
    await this.measurementRepository.remove(measurement);
  }

  private calculateIMC(weight: number, height: number): number {
    // IMC = peso (kg) / (altura (m))^2
    // Soporta altura en cm (>= 10) o en metros (< 10)
    const heightInMeters = height >= 10 ? height / 100 : height;
    if (heightInMeters <= 0) {
      return 0; // evitar divisiones inválidas; validación formal está en DTO
    }
    const imc = weight / (heightInMeters * heightInMeters);
    return Math.round(imc * 100) / 100; // Redondear a 2 decimales
  }
}
