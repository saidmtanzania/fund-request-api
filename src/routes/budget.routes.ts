import express from 'express';
import * as budgetController from '../controllers/budget.controller';
import * as middleware from '../middlewares/middleware';

const router = express.Router();
router.use(middleware.protect, middleware.restrictTo('finance'));
middleware.hasPermission({
  resources: { on_request: true },
  actions: ['create', 'read', 'update'],
});

router
  .route('/')
  .get(budgetController.getBudget)
  .post(middleware.checkBudgetCreationDate, budgetController.createBudget);
// router.route('/:id').get(budgetController.getRequest).patch(budgetController.updateRequest);
// router.route('/:id/items').patch(budgetController.requestExemption);

export default router;
