export interface ServiceError {
  errors: string[] | { [K: string]: string };
  status: string;
  statusCode: number;
}
