import express from 'express';
import * as authController from '../controllers/auth.controller';
import * as roleController from '../controllers/role.controller';

const router = express.Router();
router.use(authController.protect);

router.route('/').get(roleController.getRole).post(roleController.createRole);
router.route('/:id').get(roleController.getRoleById).patch(roleController.updateRole).delete(roleController.deleteRole);

export default router;
