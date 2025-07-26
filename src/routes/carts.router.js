

export default (cartManager, express) => {
  const router = express.Router();

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

  router.delete('/:cid/products/:pid', async (req, res) => {
    const cart = await cartManager.removeProductFromCart(req.params.cid, req.params.pid);
    if (cart) res.status(200).json(cart);
    else res.status(404).send('No se pudo eliminar el producto del carrito');
  });

  router.put('/:cid', async (req, res) => {
    const { products } = req.body;
    const cart = await cartManager.updateCart(req.params.cid, products);
    if (cart) res.status(200).json(cart);
    else res.status(404).send('No se pudo actualizar el carrito');
  });

  router.put('/:cid/products/:pid', async (req, res) => {
    const { quantity } = req.body;
    const cart = await cartManager.updateProductQuantity(req.params.cid, req.params.pid, quantity);
    if (cart) res.status(200).json(cart);
    else res.status(404).send('No se pudo actualizar la cantidad del producto en el carrito');
  });

  router.delete('/:cid', async (req, res) => {
    const cart = await cartManager.clearCart(req.params.cid);
    if (cart) res.status(200).json(cart);
    else res.status(404).send('No se pudo vaciar el carrito');
  });

  return router;
};
