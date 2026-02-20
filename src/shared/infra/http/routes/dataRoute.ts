import { Router } from 'express';
import { validateBody, validateParams, validateQuery } from '@shared/infra/http/middlewares/validation';
import {
  createDataSchema,
  editDataSchema,
  productCodeParamSchema,
  paginationQuerySchema,
} from '@shared/validation/schemas';

import { CreateDataController } from '@modules/data/useCases/createData/createDataController';
import { DeleteDataController } from '@modules/data/useCases/deleteData/deleteDataController';
import { EditDataController } from '@modules/data/useCases/editData/editDataController';
import { ListAllDataController } from '@modules/data/useCases/listAllData/listAllDataController';
import { ListDataByIdController } from '@modules/data/useCases/listDataById/listDataByIdController';

const dataRoutes = Router();
const dataPrefix = `/`;

const listAllDataController = new ListAllDataController();
const listDataByIdController = new ListDataByIdController();
const createDataController = new CreateDataController();
const editDataController = new EditDataController();
const deleteDataController = new DeleteDataController();

dataRoutes.get(
  '/',
  validateQuery(paginationQuerySchema),
  listAllDataController.handle
);

dataRoutes.get(
  '/:product_code',
  validateParams(productCodeParamSchema),
  listDataByIdController.handle
);

dataRoutes.post(
  '/',
  validateBody(createDataSchema),
  createDataController.handle
);

dataRoutes.put(
  '/:product_code',
  validateParams(productCodeParamSchema),
  validateBody(editDataSchema),
  editDataController.handle
);

dataRoutes.delete(
  '/:product_code',
  validateParams(productCodeParamSchema),
  deleteDataController.handle
);

export { dataRoutes, dataPrefix };
