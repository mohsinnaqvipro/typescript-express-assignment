import { Response } from 'express';
import { ResponseStatusCodes } from '../enums/ResponseStatusCode';

export function successResponse(message: string, data: any, res: Response) {
    res.status(ResponseStatusCodes.success).json({
        status: ResponseStatusCodes.success,
        message: (message || "success"),
        data: data
    });
}

export function insufficientParameters(data: any, res: Response) {
    res.status(ResponseStatusCodes.bad_request).json({
        status: ResponseStatusCodes.bad_request,
        message: "Insufficient parameters",
        data: data
    });
}

export function dbError(err: any, res: Response) {
    res.status(ResponseStatusCodes.database_operation_failed).json({
        status: ResponseStatusCodes.database_operation_failed,
        message: "Database Operation Failed",
        data: ''
    });
}

export function internalServerError(message: string, err: any, res: Response) {
    res.status(ResponseStatusCodes.internal_server_error).json({
        status: ResponseStatusCodes.internal_server_error,
        message: "Internal Server Error",
        data: ''
    });
}

export function unAuthorized(message: string, err: any, res: Response) {
    res.status(ResponseStatusCodes.un_authorized).json({
        status: ResponseStatusCodes.un_authorized,
        message: message,
        data: ''
    });
}

export function emailAlreadyExist(message: string, err: any, res: Response) {
    res.status(ResponseStatusCodes.bad_request).json({
        status: ResponseStatusCodes.bad_request,
        message: message,
        data: ''
    });
}
