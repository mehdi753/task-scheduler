import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Patch,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { Job } from './entities/job.entity';
import { UpdateJobDto } from './dto/update-job.dto';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  async create(@Body() createJobDto: CreateJobDto): Promise<Job> {
    return await this.jobsService.create(createJobDto);
  }

  @Get()
  async findAll(
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
  ): Promise<{
    limit: number;
    offset: number;
    jobs: Job[];
  }> {
    return await this.jobsService.findAll(limit, offset);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Job> {
    return await this.jobsService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() job: UpdateJobDto,
  ): Promise<Job> {
    return await this.jobsService.update(+id, job);
  }
}
