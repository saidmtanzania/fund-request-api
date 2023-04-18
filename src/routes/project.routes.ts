import express from 'express';
import * as projectController from '../controllers/project.controller';
import * as middleware from '../middlewares/middleware';

const router = express.Router();
router.use(middleware.protect);

router.route('/').get(projectController.getAllProject).post(projectController.createProject);
router
  .route('/:id')
  .get(projectController.getProject)
  .patch(projectController.updateProject)
  .delete(projectController.deleteProject);

export default router;
