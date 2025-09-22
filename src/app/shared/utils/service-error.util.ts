import { ServiceError } from 'src/app/models/service-error';

export function getError(error: ServiceError) {
  return Array.isArray(error.errors) ? error.errors[0] : Object.values(error.errors)[0];
}
