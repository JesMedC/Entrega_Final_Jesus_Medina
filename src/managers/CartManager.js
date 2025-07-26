import Cart from '../models/cart.model.js';

export default class CartManager {
  async getById(id) {
    return await Cart.findById(id).populate('products.product').lean();
  }

  async createCart() {
    return await Cart.create({ products: [] });
  }

  async addProductToCart(cartId, productId) {
    const cart = await Cart.findById(cartId);
    if (!cart) return null;

    const existingProduct = cart.products.find(p => p.product.toString() === productId);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await cart.save();
    return cart;
  }

  async removeProductFromCart(cartId, productId) {
    const cart = await Cart.findById(cartId);
    if (!cart) return null;

    cart.products = cart.products.filter(p => p.product.toString() !== productId);

    await cart.save();
    return cart;
  }

  async updateCart(cartId, products) {
    const cart = await Cart.findById(cartId);
    if (!cart) return null;

    cart.products = products;

    await cart.save();
    return cart;
  }

  async updateProductQuantity(cartId, productId, quantity) {
    const cart = await Cart.findById(cartId);
    if (!cart) return null;

    const product = cart.products.find(p => p.product.toString() === productId);
    if (!product) return null;

    product.quantity = quantity;

    await cart.save();
    return cart;
  }

  async clearCart(cartId) {
    const cart = await Cart.findById(cartId);
    if (!cart) return null;

    cart.products = [];

    await cart.save();
    return cart;
  }
}