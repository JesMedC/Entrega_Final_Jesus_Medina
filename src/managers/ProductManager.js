import Product from '../models/product.model.js';

export default class ProductManager {
  async getAll(params) {
    const { limit = 10, page = 1, sort, query } = params;
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      lean: true,
    };

    if (sort) {
      options.sort = { price: sort === 'asc' ? 1 : -1 };
    }

    const queryOptions = {};
    if (query) {
      queryOptions.category = query;
    }

    const products = await Product.paginate(queryOptions, options);
    return products;
  }

  async getById(id) {
    return await Product.findById(id).lean();
  }

  async addProduct(product) {
    return await Product.create(product);
  }

  async deleteProduct(id) {
    return await Product.findByIdAndDelete(id);
  }

  async updateProduct(id, product) {
    return await Product.findByIdAndUpdate(id, product, { new: true });
  }
}