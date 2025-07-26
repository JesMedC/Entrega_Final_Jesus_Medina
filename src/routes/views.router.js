import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';
import CartManager from '../managers/CartManager.js';

const productManager = new ProductManager();
const cartManager = new CartManager();

const router = Router();

router.get('/', async (req, res) => {
  const { page = 1, limit = 10, sort, query } = req.query;
  const products = await productManager.getAll({ page, limit, sort, query });
  res.render('home', { 
    products: products.docs,
    hasPrevPage: products.hasPrevPage,
    hasNextPage: products.hasNextPage,
    prevPage: products.prevPage,
    nextPage: products.nextPage,
    page: products.page,
    totalPages: products.totalPages
  });
});

router.get('/realtimeproducts', async (req, res) => {
  const products = await productManager.getAll({});
  res.render('realTimeProducts', { products: products.docs });
});

router.get('/products/:pid', async (req, res) => {
  const product = await productManager.getById(req.params.pid);
  res.render('product', { product });
});

router.get('/carts/:cid', async (req, res) => {
  const cart = await cartManager.getById(req.params.cid);
  res.render('cart', { cart });
});

export default () => router;