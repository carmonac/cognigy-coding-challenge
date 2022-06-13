export class BadRequestError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = 400;
    this.name = this.constructor.name;
  }
}

export class InternalServerError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = 500;
    this.name = this.constructor.name;
  }
}

export class UnauthorizedError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = 401;
    this.name = this.constructor.name;
  }
}

export class ForbiddenError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = 403;
    this.name = this.constructor.name;
  }
}

export class NotFoundError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = 404;
    this.name = this.constructor.name;
  }
}
