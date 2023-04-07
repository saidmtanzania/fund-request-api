import express from 'express';
import * as authController from '../controllers/authController';
import * as categoryController from '../controllers/categoryController';

const router = express.Router();
router.use(authController.protect);

router.route('/').get(categoryController.getAllCategory).post(categoryController.createCategory);
router
  .route('/:id')
  .get(categoryController.getCategory)
  .patch(categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

export default router;
