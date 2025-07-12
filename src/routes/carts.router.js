import { Router } from 'express';
import CartManager from '../managers/CartManager.js';

const cartManager = new CartManager('./src/data/carts.json');

const router = Router();

router.post('/', async (req, res) => {
  const cart = await cartManager.createCart();
  res.status(201).json(cart);
});

router.get('/:cid', async (req, res) => {
  const cart = await cartManager.getById(req.params.cid);
  if (cart) res.json(cart);
  else res.status(404).send('Carrito no encontrado');
});

router.post('/:cid/product/:pid', async (req, res) => {
  const cart = await cartManager.addProductToCart(req.params.cid, req.params.pid);
  if (cart) res.status(200).json(cart);
  else res.status(404).send('No se pudo agregar producto al carrito');
});

export default () => router;
