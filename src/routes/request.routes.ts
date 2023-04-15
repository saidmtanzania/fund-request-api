import express from 'express';
import * as authController from '../controllers/auth.controller';
import * as requestController from '../controllers/fund.controller';

const router = express.Router();
router.use(
  authController.protect,
  authController.restrictTo('finance', 'staff'),
  authController.hasPermission({
    resources: { on_request: true },
    actions: ['create', 'read', 'update', 'approve', 'reject'],
  })
);
router.route('/').get(requestController.getAllRequest).post(requestController.sendRequest);
router.route('/:id').get(requestController.getRequest).patch(requestController.updateRequest);

export default router;
