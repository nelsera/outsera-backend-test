export type AppErrorCode = "DATABASE_NOT_READY" | "CSV_NOT_LOADED" | "UNEXPECTED_ERROR";

export type AppError = {
  name: "AppError";
  message: string;
  code: AppErrorCode;
  statusCode: number;
};

export function createAppError(message: string, code: AppErrorCode, statusCode: number): AppError {
  return {
    name: "AppError",
    message,
    code,
    statusCode,
  };
}
