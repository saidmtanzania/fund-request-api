import express from 'express';
import * as authController from '../controllers/auth.controller';
import * as projectController from '../controllers/project.controller';

const router = express.Router();
router.use(authController.protect);

router.route('/').get(projectController.getAllProject).post(projectController.createProject);
router
  .route('/:id')
  .get(projectController.getProject)
  .patch(projectController.updateProject)
  .delete(projectController.deleteProject);

export default router;
