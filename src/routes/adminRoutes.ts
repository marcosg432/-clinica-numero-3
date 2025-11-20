import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth';
import { apiLimiter, authLimiter } from '../middleware/rateLimiter';
import { validate, treatmentValidation, loginValidation } from '../middleware/validator';
import { upload } from '../utils/upload';
import * as authController from '../controllers/authController';
import * as treatmentController from '../controllers/treatmentController';
import * as appointmentController from '../controllers/appointmentController';
import * as reviewController from '../controllers/reviewController';
import * as uploadController from '../controllers/uploadController';
import * as seedController from '../controllers/seedController';

const router = Router();

// Autenticação
router.post(
  '/login',
  authLimiter,
  validate(loginValidation),
  authController.loginController
);

// Todas as rotas abaixo requerem autenticação
router.use(authenticate);
router.use(requireAdmin);

// Seed do banco de dados (popular com dados iniciais)
router.post('/seed', apiLimiter, seedController.runSeedController);

// Upload de imagens
router.post(
  '/upload',
  apiLimiter,
  upload.single('image'),
  uploadController.uploadImageController
);

// Tratamentos (CRUD)
router.get('/treatments', apiLimiter, treatmentController.getAllTreatmentsController);
router.get('/treatments/:id', apiLimiter, treatmentController.getTreatmentByIdController);
router.post(
  '/treatments',
  apiLimiter,
  validate(treatmentValidation),
  treatmentController.createTreatmentController
);
router.put(
  '/treatments/:id',
  apiLimiter,
  validate(treatmentValidation),
  treatmentController.updateTreatmentController
);
router.delete('/treatments/:id', apiLimiter, treatmentController.deleteTreatmentController);

// Agendamentos
router.get('/appointments', apiLimiter, appointmentController.getAllAppointmentsController);
router.get('/appointments/:id', apiLimiter, appointmentController.getAppointmentByIdController);
router.put(
  '/appointments/:id/confirm',
  apiLimiter,
  appointmentController.confirmAppointmentController
);
router.put(
  '/appointments/:id/cancel',
  apiLimiter,
  appointmentController.cancelAppointmentController
);

// Avaliações
router.get('/reviews', apiLimiter, reviewController.getAllReviewsController);
router.get('/reviews/:id', apiLimiter, reviewController.getReviewByIdController);
router.post('/reviews', apiLimiter, reviewController.createReviewController);
router.put('/reviews/:id', apiLimiter, reviewController.updateReviewController);
router.put('/reviews/:id/approve', apiLimiter, reviewController.approveReviewController);
router.delete('/reviews/:id', apiLimiter, reviewController.deleteReviewController);

export default router;








