import express from 'express';
import * as requestController from '../controllers/fund.controller';
import * as middleware from '../middlewares/middleware';

const router = express.Router();
router.use(middleware.protect, middleware.restrictTo('finance', 'staff'));
middleware.hasPermission({
  resources: { on_request: true },
  actions: ['create', 'read', 'update'],
});

router
  .route('/')
  .get(requestController.getAllRequest)
  .post(
    middleware.hasPermission({
      resources: { on_request: true },
      actions: ['create', 'read', 'update'],
    }),
    requestController.sendRequest
  );
router.route('/:id').get(requestController.getRequest).patch(requestController.updateRequest);
router.route('/:id/exempt').patch(requestController.requestExemption);
router.route('/:id/upload');

router.use(
  middleware.hasPermission({
    resources: { on_request: true },
    actions: ['read', 'approve', 'reject'],
  })
);
router.route('/:id/approve').patch(requestController.approveRequest);

export default router;
