export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public expose = true
  ) {
    super(message);
    this.name = "AppError";
  }
}
