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
      // Validaciones básicas para evitar errores de cálculo/BD
      const { weight, height } = measurementDto;
      if (weight === undefined || height === undefined) {
        throw new BadRequestException('Weight and height are required');
      }
      if (height <= 0) {
        throw new BadRequestException('Height must be greater than 0');
      }
      if (weight < 0) {
        throw new BadRequestException('Weight must be greater or equal to 0');
      }

      // Calcular IMC automáticamente
      const imc = this.calculateIMC(weight, height);
      const newMeasurement = this.measurementRepository.create({
        ...measurementDto,
        // Asegurar el tipo correcto del enum para TypeORM/TS
        checkTime: measurementDto.checkTime as CheckTime,
        imc,
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
    
    Object.assign(measurement, measurementDto);
    return await this.measurementRepository.save(measurement);
  }

  async remove(id: string): Promise<void> {
    const measurement = await this.findOne(id);
    await this.measurementRepository.remove(measurement);
  }

  private calculateIMC(weight: number, height: number): number {
    // IMC = peso (kg) / (altura (m))^2
    const heightInMeters = height / 100; // Asumiendo altura en cm
    const imc = weight / (heightInMeters * heightInMeters);
    return Math.round(imc * 100) / 100; // Redondear a 2 decimales
  }
}
