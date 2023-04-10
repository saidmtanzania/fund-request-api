import express from 'express';
import * as authController from '../controllers/auth.controller';
import * as requestController from '../controllers/fund.controller';

const router = express.Router();
router.use(authController.protect, authController.restrictTo('finance', 'staff'));
router.route('/').get(requestController.getRequest).post(requestController.sendRequest);

export default router;
