const router = require('express').Router();

const Product = require('../../models/product.model');

router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.json({ fatal: error.message });
    }
});

// GET /api/products/available
router.get('/available', async (req, res) => {
    try {
        const products = await Product.find({ available: true });
        res.json(products);
    } catch (error) {
        res.json({ fatal: error.message });
    }
});

// GET /api/products/CATEGORY
router.get('/cat/:category', async (req, res) => {
    const products = await Product.find({
        category: req.params.category
    });
    res.json(products);
});

// GET /api/products/min/PRICE
router.get('/min/:price', async (req, res) => {
    const products = await Product.find({
        price: { $gt: req.params.price }
        // $gt, $gte, $lt, $lte, $in, $nin
    });
    res.json(products);
});

// GET /api/products/min/:min/max/:max 
// GET /api/products/min/30/max/100
router.get('/min/:min/max/:max', async (req, res) => {

    const { min, max } = req.params;

    const products = await Product.find({
        price: { $gt: min, $lt: max }
    });
    res.json(products);
});

// GET /api/products/stock/:stock
// Recuperamos todos los productos con stock mayor al número que pasamos a través de la URL y que estén disponibles
router.get('/stock/:stock', async (req, res) => {
    const { stock } = req.params;

    const products = await Product.find({
        stock: { $gt: stock },
        available: true
    });
    res.json(products);
});

// GET /api/products/PRODUCTID
router.get('/:productId', async (req, res) => {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    res.json(product);
});

router.post('/', async (req, res) => {
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
});


router.put('/:productoId', async (req, res) => {
    const { productoId } = req.params;
    const productoActualizado = await Product.findByIdAndUpdate(productoId, req.body, { new: true })
    res.json(productoActualizado)
})

router.put('/productoId', (req, res) => {
    const productoId = req.params;
})

router.delete('/:productId', async (req, res) => {
    const { producId } = req.params;
    const p = await Product.findByIdAndDelete(producId)
    res.json(p)
})

module.exports = router;