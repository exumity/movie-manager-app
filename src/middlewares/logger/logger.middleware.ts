import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('LoggerMiddleware');
  use(req: any, res: any, next: () => void) {
    this.logger.log(
      `Incoming Request Length=> ${JSON.stringify(req.body).length}`,
    );
    next();
  }
}
