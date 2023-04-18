import express from 'express';
import * as categoryController from '../controllers/category.controller';
import * as middleware from '../middlewares/middleware';

const router = express.Router();
router.use(middleware.protect);

router.route('/').get(categoryController.getAllCategory).post(categoryController.createCategory);
router
  .route('/:id')
  .get(categoryController.getCategory)
  .patch(categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

export default router;
