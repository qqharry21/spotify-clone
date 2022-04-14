/** @format */

const dev = process.env.NODE_ENV !== 'production';

export const url = dev ? 'http://localhost:3000' : 'https://papa-spotify-clone.vercel.app';
