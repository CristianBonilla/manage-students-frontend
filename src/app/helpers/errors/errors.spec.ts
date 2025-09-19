import { ValidationErrors } from '@angular/forms';
import { DEFAULT_ERROR_MESSAGE, resolveErrorMessage } from '@helpers/errors/errors';

describe('ErrorsHelpers', () => {
  describe('#resolveErrorMessage', () => {
    it('should correctly resolve an error message without interpolation', () => {
      // arrange
      const error: ValidationErrors = { required: true };
      // act
      const message = resolveErrorMessage(error);
      // assert
      expect(message).toBe('Este campo es requerido.');
    });

    it('should correctly resolve an error message interpolating the values', () => {
      // arrange
      const error: ValidationErrors = { telBetweenDigits: { min: 2, max: 4 } };
      // act
      const message = resolveErrorMessage(error);
      // assert
      expect(message).toBe('El número de telefono debe tener entre 2 y 4 dígitos.');
    });

    it('should return a default error on unrecognized error messages', () => {
      // arrange
      const error: ValidationErrors = { customUnrecognizedError: true };
      // act
      const message = resolveErrorMessage(error);
      // assert
      expect(message).toBe(DEFAULT_ERROR_MESSAGE);
    });

    it('should return a default error if no error found', () => {
      // arrange
      const error: ValidationErrors | null = null;
      // act
      const message = resolveErrorMessage(error);
      // assert
      expect(message).toBe(DEFAULT_ERROR_MESSAGE);
    });

    it('should return a default error on malformed messages', () => {
      // arrange
      const error: ValidationErrors = { telBetweenDigits: null };
      // act
      const message = resolveErrorMessage(error);
      // assert
      expect(message).toBe(DEFAULT_ERROR_MESSAGE);
    });

    it('should return a default error on malformed messages with objects instead of primitive values', () => {
      // arrange
      const error: ValidationErrors = { minlength: { min: { foo: 'bar' } } };
      // act
      const message = resolveErrorMessage(error);
      // assert
      expect(message).toBe(DEFAULT_ERROR_MESSAGE);
    });
  });
});
