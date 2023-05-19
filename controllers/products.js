const Product = require('../models/Product');

// middleware of post request to add a product
exports.createProduct = (req, res, next) => {
  delete req.body._id;
    const product = new Product({
      ...req.body
    });
    Product.findOne({ id: req.body.id })
      .then(((result) => {
        if (result === null) {
          product.save()
            .then(() => res.status(201).json({message: 'Your product has been created'}))
            .catch((error) => res.status(400).json({ error }));
        } else {
          res.status(403).json({ error: 'The product has already been created' });
        }
      }))
      .catch((error) => res.status(400).json({ error }));
  };

// middleware of patch request to modify a product
exports.modifyProduct = (req, res, next) => {
  const updates = req.body;
  Product.findOne({ id: req.params.id })
    .then(() => {
      Product.updateOne({ id: req.params.id }, { $set: updates, id: req.params.id })
        .then(() => res.status(200).json({ message: 'The product has been modified !' }))
        .catch((error) => res.status(401).json({ error }));
    })
    .catch((error) => res.status(400).json({ error }));
};

// middleware of delete request to delete a product
exports.deleteProduct = (req, res, next) => {
    Product.findOne({ id: req.params.id })
      .then((element) => { 
        if(element === null) {
          res.status(403).json({ message: 'Unauthorized request' });
        } else {
          Product.deleteOne({ id: req.params.id })
        .then(res.status(200).json({ message: 'The product has been deleted !'}))
        .catch((error) => res.status(401).json({ error }));
        }
      })
      .catch((error) => res.status(500).json({ error }));
};

// middleware of get request to obtain details of one product
exports.getOneProduct = (req, res, next) => {
    Product.findOne({ id: req.params.id })
        .then((product) => { 
          if(product === null) {
            res.status(403).json({ message: 'The product does not exist' });
          } else {
            res.status(200).json(product);
          }})
        .catch((error) => res.status(404).json({ error }));
};

// middleware of get request to obtain all products that are present in the database
exports.getAllProducts = (req, res) => {
    Product.find()
        .then((products) => res.status(200).json(products))
        .catch((error) => res.status(400).json({ error }));
};
