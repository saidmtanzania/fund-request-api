import express from 'express';
import * as authController from '../controllers/auth.controller';
import * as categoryController from '../controllers/category.controller';

const router = express.Router();
router.use(authController.protect);

router.route('/').get(categoryController.getAllCategory).post(categoryController.createCategory);
router
  .route('/:id')
  .get(categoryController.getCategory)
  .patch(categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

export default router;
