const express = require('express');
const router = express.Router();
const multer = require('multer');
const Product = require('../models/Product');

// Image Storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Create Product
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name,
      image: req.file?.path,
      description: req.body.description,
      price: req.body.price
    });
    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get All
router.get('/', async (req, res) => {
  const products = await Product.find();
  res.status(200).json(products);
});

// Get by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await Product.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not Found' });
    res.json(item);
  } catch {
    res.status(400).json({ error: 'Invalid ID' });
  }
});

// Update
router.put('/:id', upload.single('image'), async (req, res) => {
  const data = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price
  };
  if (req.file) data.image = req.file.path;

  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not Found' });
    res.json(updated);
  } catch {
    res.status(400).json({ error: 'Invalid Request' });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Not Found' });
    res.json({ message: 'Deleted' });
  } catch {
    res.status(400).json({ error: 'Invalid ID' });
  }
});

module.exports = router;
