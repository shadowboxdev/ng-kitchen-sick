import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationFailed extends HttpException {
  private readonly errors!: Record<string, any>;

  constructor(errors: Record<string, any>) {
    super(
      'Some entities failed, please check',
      HttpStatus.UNPROCESSABLE_ENTITY
    );

    this.errors = errors;
  }

  public getErrors(): Record<string, any> {
    return this.errors;
  }
}
