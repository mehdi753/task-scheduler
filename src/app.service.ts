import { Injectable } from '@nestjs/common';
import * as serviceInfo from '../package.json';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly config: ConfigService) {}
  info() {
    return {
      service: serviceInfo.name,
      version: serviceInfo.version,
      env: this.config.get('env'),
    };
  }
}
