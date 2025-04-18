import { Router } from 'express';
import * as movieController from '../controllers/movie.controller';

const router = Router();

// Endpoints pour les films
console.group('📝 Endpoints for movies');
router.get('/', movieController.getAllMovies);
router.post('/', movieController.createMovie);
router.delete('/', movieController.deleteAllMovies);
router.get('/:id', movieController.getMovieById);
router.put('/:id', movieController.updateMovie);
router.delete('/:id', movieController.deleteMovie);
console.groupEnd();

export default router;
