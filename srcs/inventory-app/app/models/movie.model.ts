// src/models/movie.model.ts
import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

// Interface définissant les attributs du modèle Movie
interface MovieAttributes {
    id: number;
    title: string;
    description: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// Interface définissant les attributs optionnels pour la création
interface MovieCreationAttributes extends Optional<MovieAttributes, 'id'> {}

// Définition du modèle Movie
class Movie extends Model<MovieAttributes, MovieCreationAttributes> implements MovieAttributes {
    public id!: number;
    public title!: string;
    public description!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

// Initialisation du modèle Movie
Movie.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'movies',
    }
);

export default Movie;
