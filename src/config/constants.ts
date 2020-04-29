import environments from './environments';

if (process.env.NODE_ENV !== 'production') {
    const environment = environments;
}

// Añade tus constantes aquí, si hace falta cogiendo de las variables de entorno

// Agregando collections de la base de datos.
export const COLLECTIONS = {
    BOOKS: 'books',
    AUTHORS: 'authors'
}; 