export interface ServiceError {
  errors: string[] | object;
  status: string;
  statusCode: number;
}
