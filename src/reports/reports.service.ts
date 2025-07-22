import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dto/create-report.dto';
import { User } from 'src/users/entities/user.entity';
import { GetEstimateDto } from './dto/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly reportsRepository: Repository<Report>,
  ) {}

  findAll() {
    return `This action returns all reports`;
  }

  findOne(id: number) {
    return `This action returns a #${id} report`;
  }

  create(payload: CreateReportDto, user: User) {
    const report = this.reportsRepository.create(payload);
    report.user = user;

    return this.reportsRepository.save(report);
  }

  async changeApproval(id: string, payload: boolean) {
    const report = await this.reportsRepository.findOne({
      where: { id: parseInt(id) },
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    report.approved = payload;
    return this.reportsRepository.save(report);
  }

  createEstimate(query: GetEstimateDto) {
    const { make, model, lat, lng, mileage, year } = query;

    return this.reportsRepository
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make', { make })
      .andWhere('model = :model', { model })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
      .andWhere('year - :year BETWEEN -3 AND 3', { year })
      .andWhere('approved IS TRUE')
      .orderBy('ABS(mileage - :mileage)', 'DESC', 'NULLS LAST')
      .setParameters({ mileage })
      .limit(3)
      .getRawOne();
  }

  remove(id: number) {
    return `This action removes a #${id} report`;
  }
}
