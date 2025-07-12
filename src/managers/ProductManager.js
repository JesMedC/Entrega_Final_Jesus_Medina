import fs from 'fs/promises';

export default class ProductManager {
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
    const products = await this.getAll();
    return products.find(p => p.id === id);
  }

  async addProduct(product) {
    const products = await this.getAll();
    const id = Date.now().toString();
    const newProduct = { id, ...product };
    products.push(newProduct);
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return newProduct;
  }

  async deleteProduct(id) {
    let products = await this.getAll();
    products = products.filter(p => p.id !== id);
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
  }
}
