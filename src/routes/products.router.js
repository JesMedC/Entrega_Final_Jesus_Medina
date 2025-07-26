import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MULTER CONFIG
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/uploads/'));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

export default (productManager, io) => {
  const router = Router();

  router.get('/', async (req, res) => {
    const { limit, page, sort, query } = req.query;
    const products = await productManager.getAll({ limit, page, sort, query });

    const response = {
      status: 'success',
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: products.hasPrevPage ? `/api/products?page=${products.prevPage}` : null,
      nextLink: products.hasNextPage ? `/api/products?page=${products.nextPage}` : null,
    };

    res.json(response);
  });

  router.get('/:pid', async (req, res) => {
    const product = await productManager.getById(req.params.pid);
    if (product) res.json(product);
    else res.status(404).send('Producto no encontrado');
  });

  router.post('/', upload.single('thumbnail'), async (req, res) => {
    const { title, description, code, price, status, stock, category } = req.body;
    const thumbnailPath = req.file ? `/uploads/${req.file.filename}` : null;

    const product = {
      title,
      description,
      code,
      price: parseFloat(price),
      status: status === 'true',
      stock: parseInt(stock),
      category,
      thumbnails: thumbnailPath ? [thumbnailPath] : []
    };

    const newProduct = await productManager.addProduct(product);
    io.emit('productListUpdated', await productManager.getAll({}));
    res.redirect('/realtimeproducts');
  });

  router.delete('/:pid', async (req, res) => {
    await productManager.deleteProduct(req.params.pid);
    io.emit('productListUpdated', await productManager.getAll({}));
    res.sendStatus(204);
  });

  return router;
};