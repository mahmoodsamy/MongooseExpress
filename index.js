// notes .. i used async and await becuse this action take long time



// require some pakges 
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
// Create a new middleware function
const methodOverride = require('method-override')



//path to get product and connection with the mongo data base 
const Product = require('./models/product');
mongoose.connect('mongodb://localhost:27017/farmStand', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MOGO CONNECTION ERROR!!!!")
        console.log(err)
    })



// middlewares
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))

// create list of categorise to use it in (new.ejs),(edit.ejs)
const categories = ['fruit', 'vegetable', 'dairy'];


app.get('/products', async (req, res) => {
    // create category parameter
    const { category } = req.query;
    if(category){
        // get all same category of products 
        const products = await Product.find( { category })
        res.render('products/index', { products , category } ) //and change name

    } else {
        // get all category
        const products = await Product.find({})
        res.render('products/index', { products , category: 'All'} )
    }
})




app.get('/', (req,res) => {
    res.send("HI")
})

// callback responding with the categorise rendered
app.get('/products/new', (req, res) => {
    res.render('products/new', {categories})
})

// get route
app.get('/products/:id', async (req, res) => {
        // create id parameter
    const { id } = req.params;
        // find product by id
    const product = await Product.findById(id)
    res.render('products/show', { product })
})



// post route
//to show all products and find them(category)
app.post('/products', async (req , res) => {
    const newProduct = await new Product(req.body)
    await newProduct.save()
    res.redirect(`/products/${newProduct._id}`)
})


// get route
app.get('/products/:id/edit', async (req, res) => {    
        // create id parameter
    const { id } = req.params;
        // find product by id then edit it
    const product = await Product.findById(id)
    res.render('products/edit', { product , categories})
})


// put route
app.put('/products/:id', async (req, res) => {
        // create id parameter
    const { id } = req.params;
        // runValidators if true run update validators on this command
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
        // redirect to id product page
    res.redirect(`/products/${product._id}`);
})


// delete route
app.delete('/products/:id' , async(req, res) => {
        // create id parameter
    const {id} = req.params;
        // find product by id then delete it
    const deleteProduct = await Product.findByIdAndDelete(id);
        // redircet to products page
    res.redirect('/products');
})

app.listen(3000, () => {
    console.log("APP IS LISTHEING ON PORT 3000!")
})





// app.post('/products', async (req , res) => {
//     const newProduct = new Product(req.body);
//     await newProduct.save();
//     console.log(newProduct)
//     res.send('making your product!')
// })

// app.post('/products', (req,res) => {
//     console.log(req.body)
//     res.send('making your product')
// })