import Product from "../models/Product.js";

const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ error: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ id: parseInt(req.params.id) });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addProduct = async (req, res) => {
  try {
    var prod = null;
    var random = 0;
    var count = 0;
    do {
      random = Math.floor(Math.random() * 10000000);
      prod = await Product.findOne({ id: random });

      console.log("Prod: ", prod?.name);
      console.log("Null: ", count, " Random: ", random);
      count++;
    } while (prod != null);

    console.log("id:", random);

    const newProduct = {
      id: random,
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      count: req.body.count,
      image: req.body.image,
      description: req.body.description,
    };

    console.log("product: ", newProduct);
    await Product.create(newProduct);
    res.status(201).json({ message: "Product saved successfully" });
    console.log("Updated");
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err.message);
  }
};

const updateProductById = async (req, res, next) => {
  try {
    const product = await Product.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!product) {
      res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product details updated" });
  } catch (err) {
    console.log(err.message);
  }
};

const delProdById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const deleteuser = await Product.findOneAndDelete({ id: id });
    if (deleteuser == null) {
      res.status(404).json({ message: "Product not found" });
    } else {
      res.status(200).json({ message: `Product deleted with id: ${id}` });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ err: err.message });
  }
};

const delAllProducts = async (req, res, next) => {
  try {
    const deleted = await Product.deleteMany({});
    res.status(200).json({ message: "deleted all" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ err: err.message });
  }
};

const product = {
  getAllProducts,
  getProductById,
  addProduct,
  updateProductById,
  delProdById,
  delAllProducts,
};

export default product;
