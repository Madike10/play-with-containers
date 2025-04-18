// src/app.ts
import express, { Application } from 'express';
import cors from 'cors';
import movieRoutes from './routes/movie.routes';

// Initialisation de l'application Express
const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/movies', movieRoutes);

// Gestion des erreurs 404
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

export default app;
