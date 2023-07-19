import express from 'express';
import * as authController from '../controllers/auth.controller';
import * as userController from '../controllers/user.controller';
import * as middleware from '../middlewares/middleware';

const router = express.Router();

/**
 * @openapi
 * /login:
 *   post:
 *     tags:
 *       - User
 *     summary: User login
 *     description: Endpoint for user login.
 *     responses:
 *       200:
 *         description: User login successful.
 *       401:
 *         description: Unauthorized access.
 *       500:
 *         description: Internal server error.
 */

router.route('/login').post(authController.login);
router.route('/signup').post(authController.signup);
router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);
router.use(middleware.protect, middleware.restrictTo('admin', 'staff', 'finance'));

router.route('/updateMyPassword').patch(
  middleware.hasPermission({
    resources: { on_user: true },
    actions: ['read', 'update'],
  }),
  authController.updatePassword
);
router.route('/updateMe').patch(
  middleware.hasPermission({
    resources: { on_user: true },
    actions: ['read', 'update'],
  }),
  userController.updateMe
);

router.use(
  middleware.hasPermission({
    resources: { on_user: true, on_role: true },
    actions: ['create', 'read', 'update', 'delete'],
  })
);
router.route('/').get(userController.getAllUser).post(userController.createUser);
router.route('/:id').get(userController.getUser).patch(userController.updateUser).delete(userController.deleteUser);

export default router;
