import { Request, Response } from "express";
import Product from "../models/Product.model";

const createProduct = async (req: Request, res: Response) => {
  const {
    name,
    description,
    images,
    category,
    minPrice,
    maxPrice,
    subCategory,
    productType,
    sizes,
    flavour,
    toppings,
  } = req.body;

  if (
    !name ||
    !description ||
    !images ||
    !category ||
    !minPrice ||
    !maxPrice ||
    !productType ||
    !sizes ||
    !subCategory ||
    !toppings
  ) {
    return res.status(404).json({
      error: true,
      message: "Please fill out all fields",
    });
  }

  try {
    const categoryDetails = await Product.create({
      name,
      description,
      images,
      category,
      minPrice,
      maxPrice,
      subCategory,
      productType,
      sizes,
      flavour,
      toppings,
    });

    return res.status(200).json({
      error: false,
      categoryDetails,
      message: "Category Created successfully",
    });
  } catch (err) {
    return res.status(500).json({
      error: true,
      err,
      message: "Internal server error",
    });
  }
};

const editProduct = async (req: Request, res: Response) => {
  const { productId } = req.params;
  const {
    name,
    description,
    images,
    category,
    minPrice,
    maxPrice,
    subCategory,
    productType,
    sizes,
    flavour,
    toppings,
  } = req.body;

  try {
    const productDetails = await Product.findOne({ _id: productId });
    if (!productDetails) {
      return res.status(400).json({
        error: true,
        message: "product not found",
      });
    }

    if (name) productDetails.name = name;
    if (description) productDetails.description = description;
    if (images) productDetails.images = images;
    if (category) productDetails.category = category;
    if (minPrice) productDetails.minPrice = minPrice;
    if (maxPrice) productDetails.maxPrice = maxPrice;
    if (subCategory) productDetails.subCategory = subCategory;
    if (sizes) productDetails.sizes = sizes;
    if (flavour) productDetails.flavour = flavour;
    if (productType) productDetails.productType = productType;
    if (toppings) productDetails.toppings = toppings;

    await productDetails.save();
    res.json({
      error: false,
      productDetails,
      message: "Product updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      err,
      message: "Internal server Error",
    });
  }
};

const getProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const productDetails = await Product.findOne({ _id: productId });
    if (!productDetails) {
      return res.status(400).json({
        error: true,
        message: "product not found",
      });
    }

    return res.json({
      error: false,
      productDetails,
      message: "Category Retrieved successfully",
    });
  } catch (err) {
    return res.status(500).json({
      error: true,
      err,
      message: "Internal Server error",
    });
  }
};

const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { 
      subCategoryIds, 
      categoryIds, 
      minPrice, 
      maxPrice, 
      searchQuery, 
      page = 1, 
      limit = 10 
    } = req.query;

    const filters: any = {};
    
    if (categoryIds) {
      filters['category.id'] = { $in: (categoryIds as string).split(',') };
    }

    if (subCategoryIds) {
      filters['subCategory.id'] = { $in: (subCategoryIds as string).split(',') };
    }

    if (minPrice || maxPrice) {
      filters.minPrice = {};
      if (minPrice) filters.minPrice.$gte = parseFloat(minPrice as string);
      if (maxPrice) filters.minPrice.$lte = parseFloat(maxPrice as string);
    }

    if (searchQuery && (searchQuery as string).trim() !== '') {
      filters.$or = [
        { name: { $regex: searchQuery as string, $options: 'i' } },
        { description: { $regex: searchQuery as string, $options: 'i' } }
      ];
    }
    
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const productDetails = await Product.find(filters)
      .skip(skip)
      .limit(parseInt(limit as string))
      .exec();

    const totalProducts = await Product.countDocuments(filters);
    const totalPages = Math.ceil(totalProducts / parseInt(limit as string));
    
    return res.status(200).json({
      error: false,
      products: productDetails,
      totalPages,
      currentPage: parseInt(page as string), 
      totalProducts,            
      message: "Products retrieved successfully",
    });
  } catch (err) {
    return res.status(500).json({
      error: true,
      err,
      message: "Internal Server error",
    });
  }
};

const deleteProduct = async (req: Request, res: Response) => {
  const { productId } = req.params;
  try {
    const productDetails = await Product.deleteOne({ _id: productId });
    if (!productDetails) {
      return res.status(404).json({
        error: true,
        message: "product not found",
      });
    }
    return res.json({
      error: false,
      message: "product deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      err,
      message: "Internal server Error",
    });
  }
};


export {
  createProduct,
  editProduct,
  deleteProduct,
  getAllProducts,
  getProduct
};
