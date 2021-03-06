import 'reflect-metadata'
import createConnection from './database'
import express from 'express';
import { router } from './routers';

createConnection();
const app = express();
app.use(express.json())

app.use(router)

export { app }