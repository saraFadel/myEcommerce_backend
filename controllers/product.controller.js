const Product =  require('../models/product.model');
const memoryCache = require('../utilities/memoryCache.utility');
const cacheKey = 'productsList';


exports.addProduct = async(req, res) => {
    memoryCache.del(cacheKey);
    const {name, desc, price, slug, stock, category} = req.body;

    let imgURL = req.file.filename;
    // if(!imgURL.startsWith('http'))
    //     imgURL = process.env.BACKEND_UPLOADS_URL + imgURL
    const newProduct = await Product.create({name, desc, price, slug, stock, category, imgURL});
    res.status(201).json({
        message: 'New Product Created', data: newProduct
    });
};

exports.getAllProducts = async(req, res) => {
    const cachedProducts = memoryCache.get(cacheKey);
    if(cachedProducts){
        return res.status(200).json({
        message: 'Cached Products full list',
        data: cachedProducts
    });
    }    
    // const products = await Product.find().populate('category', 'name slug parentId -_id', populate('category.parentId', 'name slug'));
    const products = await Product.find()
  .populate({
    path: 'category',          // 1. First, populate the category ID on the product
    select: 'name slug parentId', // 2. Make sure to include parentId so we can jump further
    populate: {                // 3. NESTED: Now populate the parentId inside that category
      path: 'parentId',
      select: 'name slug'      // 4. Get the name of the "Grandparent" or Parent
    }
  });

    memoryCache.set(cacheKey, products);
    res.status(200).json({
        message: 'Products full list',
        data: products
    });
};

exports.getProductbySlug = async(req, res) => {
    const {slug} = req.params;
    // if(memoryCache.get(cacheKey)){
    //     const cachedProduct = memoryCache.get(cacheKey).filter(product => product.slug === slug);
    //     return res.status(200).json({
    //         message: `Get cached product by slug ${slug}`,
    //         data: cachedProduct  
    //     });
    // }
    
    // const product = await Product.findOne({slug}).populate('category', 'name slug parentId');
    
    const product = await Product.findOne({ slug })
    .populate({
        path: 'category', select: 'name slug parentId', populate: {
            path: 'parentId',
            select: 'name' 
        }
    });
    if(!product){
        return res.status(404).json({
            message: `can't find product with this slug ${slug}`,
        });
    }
    return  res.status(200).json({
            message: `Get product by slug ${slug}`,
            data: product  
        });
};

exports.getProductbyId = async(req, res) => {
    const {id} = req.params;
    console.log(memoryCache.get(cacheKey));
    if(memoryCache.get(cacheKey)){
        const cachedProduct = memoryCache.get(cacheKey).find(product => product._id == id);
        if(cachedProduct){
            return res.status(200).json({
                message: `Get cached product by id ${id}`,
                data: cachedProduct  
            });
        }
    }
    
    const product = await Product.findOne({_id: id});
    if(!product){
        return res.status(404).json({
            message: `can't find product with this id ${id}`,
        });
    }
    return  res.status(200).json({
            message: `Get product by id ${id}`,
            data: product  
        });
};

exports.deleteProductById = async (req, res) => {
    const id = req.params.id;
    const deletedProduct = await Product.findOneAndDelete({ _id: id});
    if(!deletedProduct){
        return res.status(404).json({
            message: `can't find product with this id ${id}`,
        })
    }
    res.status(200).json({
        message: `Product with id: ${id} is deleted`,
        data: deletedProduct
    });
    memoryCache.del(cacheKey); 
};

exports.editProductById = async(req, res) => {
    memoryCache.del(cacheKey);

    const {id} = req.params;
    const {name, desc, price, slug, stock, category} = req.body;

    let updatedData = { name, desc, price, slug, stock, category };

    if (req.file) {
        updatedData.imgURL = req.file.filename;
    }
        
    const editedProduct = await Product.findByIdAndUpdate(id, updatedData, {returnDocument: 'after'});

    res.status(201).json({
        message: 'Product Updated', data: editedProduct
    });
};

exports.getRelatedsbyCategoryAndSlug = async(req, res) => {
    const {slug, categoryId} = req.params;

    const products = await Product.find({ category: categoryId, slug: {$ne : slug} });

    if(!products){
        return res.status(404).json({
            message: `can't find products with this category ${categoryId}`,
        });
    }
    return  res.status(200).json({
            message: `Get products category ${categoryId}`,
            data: products  
        });
};


