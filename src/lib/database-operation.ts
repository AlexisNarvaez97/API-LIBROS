import { COLLECTIONS } from '../config/constants';
// Lista de libros

export async function getBooks(db: any) {
    return await db.collection(COLLECTIONS.BOOKS).find().sort({id: 1}).toArray();
}

export async function getAuthors(db: any) {
    return await db.collection(COLLECTIONS.AUTHORS).find().sort({id: 1}).toArray();
}

export async function getAuthor(db: any, id: number) {
    return await db.collection(COLLECTIONS.AUTHORS).findOne({ id });
}

export async function getBook(db: any, id: number) {
    return await db.collection(COLLECTIONS.BOOKS).findOne({ id });
}