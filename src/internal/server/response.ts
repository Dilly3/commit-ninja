import { Response } from "express";

export interface apiResponse {
  message: string;
  data: any;
  status: number;
}

export interface apiError {
  message: string;
  error: any;
  status: number;
}

export const ErrInternalServer = new Error("Internal server error");
export const ErrNotFound = new Error("Not found");
export const ErrBadRequest = new Error("Bad request");
export const ErrUnauthorized = new Error("Unauthorized");
export const httpInternalServerError = 500;
export const httpNotFound = 404;
export const httpBadRequest = 400;
export const httpUnauthorized = 401;
export const httpOK = 200;

const jsonError = (res: Response, data: apiError) => {
  res.status(data.status).json(data);
};

// send a 200 OK response to the client
export const OK = (res: Response, data: any) => {
  const response = New("successful", httpOK, data);
  res.status(response.status).json(response);
};
// send a 500 internal server error response to the client
export const InternalServerError = (res: Response, msg: string) => {
  jsonError(res, {
    message: msg,
    error: "internal server error",
    status: httpInternalServerError,
  });
};
// send a 400 bad request response to the client
export const BadRequest = (res: Response, msg: string) => {
  jsonError(res, {
    message: msg,
    error: "bad request",
    status: httpBadRequest,
  });
};
// send a 404 not found response to the client
export const NotFound = (res: Response, msg: string) => {
  jsonError(res, {
    message: msg,
    error: "not found",
    status: httpNotFound,
  });
};
/**
 * Creates a new API response object.
 *
 * @param message - A descriptive message about the response
 * @param error - Any error object if an error occurred, or null if successful
 * @param status - HTTP status code for the response
 * @param data - The payload/data to be sent in the response
 * @returns {apiResponse} A structured API response object containing all provided information
 *
 * @example
 * const response = New("User created successfully", null, 201, { userId: "123" });
 */
export function New(message: string, status: number, data: any): apiResponse {
  return {
    message,
    data,
    status,
  };
}
