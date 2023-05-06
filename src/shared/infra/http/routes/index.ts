import { Router } from 'express';
import { handlingErrors } from '@shared/infra/http/middlewares/handlingErrors';
import { handlingNotFound } from '@shared/infra/http/middlewares/handlingNotFound';

import { dataRoutes, dataPrefix } from './dataRoute';

const routes = Router();

routes.use(dataPrefix, dataRoutes);

routes.use(handlingNotFound);
routes.use(handlingErrors);

export { routes };
