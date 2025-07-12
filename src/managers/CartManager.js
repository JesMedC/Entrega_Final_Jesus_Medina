import fs from 'fs/promises';

export default class CartManager {
  constructor(path) {
    this.path = path;
  }

  async getAll() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data) || [];
    } catch {
      return [];
    }
  }

  async getById(id) {
    const carts = await this.getAll();
    return carts.find(c => c.id === id);
  }

  async createCart() {
    const carts = await this.getAll();
    const newCart = {
      id: Date.now().toString(),
      products: []
    };
    carts.push(newCart);
    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    return newCart;
  }

  async addProductToCart(cartId, productId) {
    const carts = await this.getAll();
    const cartIndex = carts.findIndex(c => c.id === cartId);
    if (cartIndex === -1) return null;

    const cart = carts[cartIndex];
    const existingProduct = cart.products.find(p => p.product === productId);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    carts[cartIndex] = cart;
    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    return cart;
  }
}
