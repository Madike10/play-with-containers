import { Request, Response } from 'express';
import Movie from '../models/movie.model';
import {Op} from "sequelize";

// Récupérer tous les films (avec option title)
export const getAllMovies = async (req: Request, res: Response): Promise<void> => {
    console.log("getAllMovies. Req.query:", req.query)
    try {
        const titleQuery = req.query.title as string;
        let movies;

        if (titleQuery) {
            movies = await Movie.findAll({
                where: {
                    title: {
                        [Op.iLike]: `%${titleQuery}%`
                    }
                }
            });
        } else {
            movies = await Movie.findAll();
        }

        res.status(200).json(movies);
        console.info('getAllMovies. Res:', res)
    } catch (error) {
        console.error('❌ Error getting movies:', error);
        res.status(500).json({ message: 'Internal server error', error: (error as Error).message });
    }
};

// Créer un nouveau film (avec title et description)
export const createMovie = async (req: Request, res: Response): Promise<void> => {
    console.log("createMovie. Req.query:", req.query)
    try {
        const { title, description } = req.body;

        if (!title) {
            res.status(400).json({ message: 'Title is required' });
            return;
        }

        const newMovie = await Movie.create({
            title,
            description: description || ''
        });

        res.status(200).json(newMovie);
        console.info('createMovie. Res:', res)
    } catch (error) {
        console.error('❌ Error creating movie:', error);
        res.status(500).json({ message: 'Internal server error', error: (error as Error).message });
    }
};

// Récupérer un film par ID (avec option title)
export const getMovieById = async (req: Request, res: Response): Promise<void> => {
    console.log("getMovieById. Req.query:", req.query)
    try {
        const id = parseInt(req.params.id);
        const movie = await Movie.findByPk(id);

        if (!movie) {
            res.status(404).json({ message: `Movie with id ${id} not found` });
            return;
        }

        res.status(200).json(movie);
        console.info('getMovieById. Res:', res)
    } catch (error) {
        console.error('❌ Error getting movie:', error);
        res.status(500).json({ message: 'Internal server error', error: (error as Error).message });
    }
};

// Mettre à jour un film (avec title et description)
export const updateMovie = async (req: Request, res: Response): Promise<void> => {
    console.log("updateMovie. Req.query:", req.query)
    try {
        const id = parseInt(req.params.id);
        const { title, description } = req.body;

        const movie = await Movie.findByPk(id);

        if (!movie) {
            res.status(404).json({ message: `Movie with id ${id} not found` });
            return;
        }

        if (!title) {
            res.status(400).json({ message: 'Title is required' });
            return;
        }

        movie.title = title;
        movie.description = description || movie.description;
        await movie.save();

        res.status(200).json(movie);
        console.info('updateMovie. Res:', res)
    } catch (error) {
        console.error('❌ Error updating movie:', error);
        res.status(500).json({ message: 'Internal server error', error: (error as Error).message });
    }
};

// Supprimer un film (avec option title)
export const deleteMovie = async (req: Request, res: Response): Promise<void> => {
    console.log("deleteMovie. Req.query:", req.query)
    try {
        const id = parseInt(req.params.id);
        const movie = await Movie.findByPk(id);

        if (!movie) {
            res.status(404).json({ message: `Movie with id ${id} not found` });
            return;
        }

        await movie.destroy();
        res.status(200).json({ message: `Movie with id ${id} deleted successfully` });
        console.info('deleteMovie. Res:', res)
    } catch (error) {
        console.error('❌ Error deleting movie:', error);
        res.status(500).json({ message: 'Internal server error', error: (error as Error).message });
    }
};

// Supprimer tous les films (sans option title)
export const deleteAllMovies = async (_req: Request, res: Response): Promise<void> => {
    console.log('deleteAllMovies. Req.query:', _req.query)
    try {
        await Movie.destroy({ where: {}, truncate: true });
        res.status(200).json({ message: 'All movies deleted successfully' });
        console.info('deleteAllMovies. Res:', res)
    } catch (error) {
        console.error('❌ Error deleting all movies:', error);
        res.status(500).json({ message: 'Internal server error', error: (error as Error).message });
    }
};
