import environments from './environments';

if (process.env.NODE_ENV !== 'production') {
    const environment = environments;
}

export const SECRET_KEY = process.env.SECRET || 'AlexisNarvaez1997';

// Añade tus constantes aquí, si hace falta cogiendo de las variables de entorno

// Agregando collections de la base de datos.
export const COLLECTIONS = {
    BOOKS: 'books',
    AUTHORS: 'authors',
    USERS: 'users'
};

export const CHANGE_AUTHORS = 'CHANGE_AUTHORS';
export const CHANGE_BOOKS = 'CHANGE_BOOKS';