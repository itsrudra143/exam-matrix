import express from 'express';
import { 
  createTest, 
  getAllTests, 
  getTestById, 
  updateTest, 
  deleteTest, 
  publishTest,
  startTest,
  submitTest,
  getTestResults,
  getAllTestAttempts,
  getUserTestAttempts
} from '../controllers/tests.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

// Admin routes
router.post('/', authenticate, authorizeAdmin, createTest);
router.put('/:id', authenticate, authorizeAdmin, updateTest);
router.delete('/:id', authenticate, authorizeAdmin, deleteTest);
router.put('/:id/publish', authenticate, authorizeAdmin, publishTest);
router.get('/attempts', authenticate, authorizeAdmin, getAllTestAttempts);

// Student and admin routes
router.get('/', authenticate, getAllTests);
router.get('/user/attempts', authenticate, getUserTestAttempts);
router.get('/:id', authenticate, getTestById);

// Student routes
router.post('/:id/start', authenticate, startTest);
router.post('/:id/submit', authenticate, submitTest);
router.get('/:id/results', authenticate, getTestResults);

export default router; 