//IMPORTS
import path from 'path';
import express from 'express';
import morgan from 'morgan';


//CONSTANTS
const publicDirectoryPath=path.join(__dirname,'../../public')
export const app = express();


//MIDDLEWARES
app.use(morgan('dev'))
app.use(express.static(publicDirectoryPath))
