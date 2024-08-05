import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { Repository } from 'typeorm';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import * as cronParser from 'cron-parser';
import { UpdateJobDto } from './dto/update-job.dto';

@Injectable()
export class JobsService implements OnModuleInit {
  private readonly logger: Logger;

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    @InjectRepository(Job)
    private jobsRepository: Repository<Job>,
  ) {
    this.logger = new Logger('JOB-SERVICE');
  }

  /**
   * @description Schedule all cronjobs on module init
   */
  async onModuleInit() {
    const limit = 100;
    let offset = 0;
    let jobs = await this.jobsRepository.find({ skip: offset, take: limit });
    while (jobs?.length > 0) {
      for (const job of jobs) {
        this.schedule(job);
      }
      offset++;
      jobs = await this.jobsRepository.find({ skip: offset, take: limit });
    }
  }

  /**
   * @description Get all jobs by pagination
   *
   * @param {number} limit limit of returned jobs
   * @param {number} offset skip
   *
   * @returns {Promise<{limit: number, offset: number, jobs: Job[]}>}
   */
  async findAll(
    limit: number,
    offset: number,
  ): Promise<{
    limit: number;
    offset: number;
    jobs: Job[];
  }> {
    const jobs = await this.jobsRepository.find({ skip: offset, take: limit });
    return {
      limit,
      offset,
      jobs,
    };
  }

  /**
   * @description Find job by id
   *
   * @param {number} id id of the cronjob
   *
   * @returns {Promise<Job>}
   */
  async findOne(id: number): Promise<Job> {
    return await this.jobsRepository.findOneBy({ id });
  }

  /**
   * @description Create a cronjob
   *
   * @param {CreateJobDto} jobData Job data
   *
   * @returns {Promise<Job>}
   */
  async create(jobData: CreateJobDto): Promise<Job> {
    const nextDate = this.getNextRun(jobData.interval);
    const job = this.jobsRepository.create({ ...jobData, next_run: nextDate });
    await this.jobsRepository.save(job);
    this.schedule(job);
    return job;
  }

  /**
   * @description Update a cronjob
   *
   * @param {number} id id of the cronjob
   * @param {UpdateJobDto} jobData Job data
   *
   * @returns {Promise<Job>}
   */
  async update(id: number, jobData: UpdateJobDto): Promise<Job> {
    const job = await this.jobsRepository.findOneBy({ id });
    if (job) {
      const result = await this.jobsRepository.update({ id }, jobData);

      if (result.affected) {
        const cronjob = this.schedulerRegistry.getCronJob(`job_${job.id}`);
        if (cronjob) {
          if (!jobData.is_enabled) {
            cronjob.stop();
          } else {
            cronjob.start();
          }
        }
      }
    }
    return { ...job, ...jobData };
  }

  /**
   * @description Schedule a cronjob and add it to scheduler registry
   *
   * @param {Job} job Job to schedule
   */
  private schedule(job: Job): void {
    const jobName = `job_${job.id}`;
    const cronjob = CronJob.from({
      cronTime: job.interval,
      onTick: async () => {
        try {
          this.logger.log(`Running job ${job.name} (${job.id})`);
          // Job logic here
          await this.jobsRepository.update(
            { id: job.id },
            {
              last_run: new Date().getTime(),
              next_run: this.getNextRun(job.interval),
            },
          );
        } catch (error) {
          this.logger.error(
            `Error running job ${job.name} (${job.id}): ${error.message}`,
          );
        }
      },
      start: job.is_enabled,
    });

    this.schedulerRegistry.addCronJob(jobName, cronjob);
  }

  /**
   * @description Get timestamp of the next run from a cronjob expression
   *
   * @param {string} interval Interval of the cronjob
   *
   * @returns {number}
   */
  private getNextRun(interval: string): number {
    const parsedCron = cronParser.parseExpression(interval);
    const nextDate = parsedCron.next().toDate().getTime();
    return nextDate;
  }
}
