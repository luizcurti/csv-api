import { Router } from 'express';

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

dataRoutes.get('/', listAllDataController.handle);
dataRoutes.get('/:product_code', listDataByIdController.handle);
dataRoutes.post('/', createDataController.handle);
dataRoutes.put('/:product_code', editDataController.handle);
dataRoutes.delete('/:product_code', deleteDataController.handle);

export { dataRoutes, dataPrefix };
