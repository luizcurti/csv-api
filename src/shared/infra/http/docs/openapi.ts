const productSchema = {
  type: 'object',
  properties: {
    product_code: { type: 'string', example: 'SKU-001' },
    quantity: { type: 'integer', example: 10 },
    pick_location: { type: 'string', example: 'A1' },
  },
  required: ['product_code', 'quantity', 'pick_location'],
};

const productInputSchema = {
  type: 'object',
  properties: {
    product_code: { type: 'string', example: 'SKU-001' },
    quantity: { type: 'integer', example: 10 },
    pick_location: { type: 'string', example: 'A1' },
  },
  required: ['product_code', 'quantity', 'pick_location'],
};

const editInputSchema = {
  type: 'object',
  properties: {
    quantity: { type: 'integer', example: 10 },
    pick_location: { type: 'string', example: 'A1' },
  },
  required: ['quantity', 'pick_location'],
};

const errorSchema = {
  type: 'object',
  properties: {
    message: { type: 'string' },
    type: { type: 'string' },
  },
};

export const openapiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'CSV API',
    version: '1.0.0',
    description:
      'REST API for CSV-backed product data with full CRUD operations, built with Clean Architecture.',
  },
  servers: [{ url: '/api/csv', description: 'Product data endpoints' }],
  tags: [{ name: 'Products' }, { name: 'Health' }],
  paths: {
    '/': {
      get: {
        tags: ['Products'],
        summary: 'List products (paginated)',
        parameters: [
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', default: 100, maximum: 1000 },
          },
          {
            name: 'offset',
            in: 'query',
            schema: { type: 'integer', default: 0, minimum: 0 },
          },
        ],
        responses: {
          '200': {
            description: 'Paginated list of products',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { type: 'array', items: productSchema },
                    pagination: {
                      type: 'object',
                      properties: {
                        total: { type: 'integer' },
                        limit: { type: 'integer' },
                        offset: { type: 'integer' },
                        hasMore: { type: 'boolean' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Products'],
        summary: 'Create a product',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: productInputSchema } },
        },
        responses: {
          '201': {
            description: 'Product created',
            content: { 'application/json': { schema: productSchema } },
          },
          '400': {
            description: 'Validation error',
            content: { 'application/json': { schema: errorSchema } },
          },
          '409': {
            description: 'Product already exists',
            content: { 'application/json': { schema: errorSchema } },
          },
        },
      },
    },
    '/{product_code}': {
      get: {
        tags: ['Products'],
        summary: 'Find a product by code',
        parameters: [
          {
            name: 'product_code',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Product found',
            content: { 'application/json': { schema: productSchema } },
          },
          '404': {
            description: 'Product not found',
            content: { 'application/json': { schema: errorSchema } },
          },
        },
      },
      put: {
        tags: ['Products'],
        summary: 'Update a product',
        parameters: [
          {
            name: 'product_code',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: editInputSchema } },
        },
        responses: {
          '200': {
            description: 'Product updated',
            content: { 'application/json': { schema: productSchema } },
          },
          '404': {
            description: 'Product not found',
            content: { 'application/json': { schema: errorSchema } },
          },
        },
      },
      delete: {
        tags: ['Products'],
        summary: 'Delete a product',
        parameters: [
          {
            name: 'product_code',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': { description: 'Product deleted' },
          '404': {
            description: 'Product not found',
            content: { 'application/json': { schema: errorSchema } },
          },
        },
      },
    },
  },
};
