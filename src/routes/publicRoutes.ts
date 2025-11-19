import { Router } from 'express';
import { apiLimiter, appointmentLimiter } from '../middleware/rateLimiter';
import { validate, appointmentValidation } from '../middleware/validator';
import * as homeController from '../controllers/homeController';
import * as treatmentController from '../controllers/treatmentController';
import * as appointmentController from '../controllers/appointmentController';
import * as reviewController from '../controllers/reviewController';

const router = Router();

// Home
router.get('/home', apiLimiter, homeController.getHomeController);
router.get('/home/gallery', apiLimiter, homeController.getGalleryController);
router.get('/home/reviews', apiLimiter, reviewController.getAllReviewsController);

// Tratamentos
router.get('/treatments', apiLimiter, treatmentController.getAllTreatmentsController);
router.get('/treatments/:slug', apiLimiter, treatmentController.getTreatmentBySlugController);

// Agendamentos
router.post(
  '/appointments',
  appointmentLimiter,
  validate(appointmentValidation),
  appointmentController.createAppointmentController
);

// Avaliações
router.post('/reviews', apiLimiter, reviewController.createReviewController);

export default router;









