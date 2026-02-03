import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World, this is the first resource of the project: AthletIA!';
  }
}
