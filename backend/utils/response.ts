import { Response } from "express";

interface SuccessResponseProps {
  statusCode?: number;
  message: string;
  data?: any;
  res: Response;
}

interface ErrorResponseProps {
  statusCode?: number;
  message: string;
  error?: any;
  res: Response;
}

export class ResponseHandler {
  static success({
    statusCode = 200,
    message,
    data = null,
    res,
  }: SuccessResponseProps) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static error({
    statusCode = 500,
    message,
    error = null,
    res,
  }: ErrorResponseProps) {
    // Log error for debugging
    if (error) {
      console.error(error);
    }

    return res.status(statusCode).json({
      success: false,
      message,
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }

  // Common error responses
  static badRequest(res: Response, message: string = "Bad Request") {
    return this.error({ res, statusCode: 400, message });
  }

  static unauthorized(res: Response, message: string = "Unauthorized") {
    return this.error({ res, statusCode: 401, message });
  }

  static forbidden(res: Response, message: string = "Forbidden") {
    return this.error({ res, statusCode: 403, message });
  }

  static notFound(res: Response, message: string = "Not Found") {
    return this.error({ res, statusCode: 404, message });
  }

  static internalServerError(res: Response, error?: any) {
    return this.error({
      res,
      statusCode: 500,
      message: "Internal Server Error",
      error,
    });
  }
}
