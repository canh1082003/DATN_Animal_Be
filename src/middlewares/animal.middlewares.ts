import { checkSchema } from 'express-validator';

const AnimalMiddleware = checkSchema({
  name: {
    notEmpty: { errorMessage: 'Name is required' },
    isString: { errorMessage: 'Name must be a string' },
  },
  shape: {
    notEmpty: { errorMessage: 'Shape is required' },
    isString: { errorMessage: 'Shape must be a string' },
  },
  species: {
    notEmpty: { errorMessage: 'Species is required' },
    isString: { errorMessage: 'Species must be a string' },
  },
  age: {
    notEmpty: { errorMessage: 'Age is required' },
    isString: {
      errorMessage: 'Age must be a positive integer',
    },
  },
  habitat: {
    optional: true,
    isString: { errorMessage: 'Habitat must be a string' },
  },
  diet: {
    notEmpty: { errorMessage: 'Diet is required' },
    isIn: {
      options: [['anco', 'anthit', 'antap']],
      errorMessage: 'Diet must be one of: anco, anthit, antap',
    },
  },
  isEndangered: {
    optional: true,
    isBoolean: { errorMessage: 'isEndangered must be a boolean' },
  },
  isDangerous: {
    optional: true,
    isBoolean: { errorMessage: 'isDangerous must be a boolean' },
  },
  description: {
    optional: true,
    isString: { errorMessage: 'Description must be a string' },
  },
});

export { AnimalMiddleware };
