import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import productsRouter from './src/routes/products.router.js';
import cartsRouter from './src/routes/carts.router.js';
import viewsRouter from './src/routes/views.router.js';
import ProductManager from './src/managers/ProductManager.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const productManager = new ProductManager('./src/data/products.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/src/public')));

// Handlebars setup
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/src/views'));

// Rutas
app.use('/api/products', productsRouter(productManager, io));
app.use('/api/carts', cartsRouter());
app.use('/', viewsRouter(productManager));

// Socket.io
io.on('connection', socket => {
  console.log('🟢 Cliente conectado');
});

httpServer.listen(8080, () => console.log('Servidor corriendo en puerto 8080'));
//conexion de mongo DB
mongoose.connect(process.env.MONGO_URI, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
 })
   .then(() => {
     console.log('Conectado a MongoDB');
   })
   .catch((error) => {
     console.error('Error al conectar a MongoDB:', error);
   });

