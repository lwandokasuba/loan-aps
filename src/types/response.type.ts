export interface IResponseError {
  statusCode: number;
  message: string;
  code: string;
  timestamp: string;
  path: string;
  method: string;
}

export interface IResponse<T> {
  statusCode: number;
  data: T;
}
