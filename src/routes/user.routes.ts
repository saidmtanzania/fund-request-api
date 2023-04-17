import express from 'express';
import * as authController from '../controllers/auth.controller';
import * as userController from '../controllers/user.controller';

const router = express.Router();

router.route('/login').post(authController.login);
router.route('/signup').post(authController.signup);
router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);
router.use(authController.protect, authController.restrictTo('admin', 'staff', 'finance'));


router.route('/updateMyPassword').patch(
  authController.hasPermission({
    resources: { on_user: true },
    actions: ['read', 'update'],
  }),
  authController.updatePassword
);
router.route('/updateMe').patch(
  authController.hasPermission({
    resources: { on_user: true },
    actions: ['read', 'update'],
  }),
  userController.updateMe
);

router.use(
  authController.hasPermission({
    resources: { on_user: true, on_role: true },
    actions: ['create', 'read', 'update', 'delete'],
  })
);
router.route('/').get(userController.getAllUser).post(userController.createUser);
router.route('/:id').get(userController.getUser).patch(userController.updateUser).delete(userController.deleteUser);

export default router;
