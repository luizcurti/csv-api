import * as Yup from 'yup';

export const productCodeSchema = Yup.string()
  .required('Product code is required')
  .min(1, 'Product code cannot be empty')
  .max(50, 'Product code too long')
  .matches(
    /^[a-zA-Z0-9_-]+$/,
    'Product code can only contain letters, numbers, hyphens and underscores'
  );

export const quantitySchema = Yup.number()
  .required('Quantity is required')
  .integer('Quantity must be an integer')
  .positive('Quantity must be positive')
  .max(999999, 'Quantity too large');

export const pickLocationSchema = Yup.string()
  .required('Pick location is required')
  .min(1, 'Pick location cannot be empty')
  .max(20, 'Pick location too long')
  .matches(
    /^[A-Z0-9 ]+$/i,
    'Pick location can only contain letters, numbers and spaces'
  );

export const createDataSchema = Yup.object({
  product_code: productCodeSchema,
  quantity: quantitySchema,
  pick_location: pickLocationSchema,
});

export const editDataSchema = Yup.object({
  quantity: quantitySchema,
  pick_location: pickLocationSchema,
});

export const productCodeParamSchema = Yup.object({
  product_code: productCodeSchema,
});
