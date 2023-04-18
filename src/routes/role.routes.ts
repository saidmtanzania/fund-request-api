import express from 'express';
import * as roleController from '../controllers/role.controller';
import * as middleware from '../middlewares/middleware';

const router = express.Router();
router.use(middleware.protect);

router.route('/').get(roleController.getRole).post(roleController.createRole);
router.route('/:id').get(roleController.getRoleById).patch(roleController.updateRole).delete(roleController.deleteRole);

export default router;
