import { Response } from "express";

interface apiResponse {
  message: string;
  data: any;
  error: Error | null;
  status: number;
}

/**
 * Sends a JSON response with the specified status code and data.
 *
 * @param res - Express Response object to send the response
 * @param data - ApiResponse object containing the message, data, error, and status
 *
 * @example
 * jsonResponse(res, New("Success", null, 200, { items: [] }));
 */
export const jsonResponse = (res: Response, data: apiResponse) => {
  res.status(data.status).json(data);
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
export function New(
  message: string,
  error: Error | null,
  status: number,
  data: any,
): apiResponse {
  return {
    message,
    data,
    error,
    status,
  };
}
