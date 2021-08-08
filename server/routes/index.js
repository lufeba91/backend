const {Router} = require('express');
const router = Router();
const {
    getAllOrdersByCustomerId, 
    postOrder, 
    getProfileData,
    getAllProducts,
    signUp,
    getProductById} = require('../controllers/index.controllers');

router.get('/', (req,res) =>{
    res.send('Hello World');
})
//router.post('/signup', isSignedUp,signUp);
//router.get('/login', checkLogin);
//router.get('/dashboard', isLoggedIn, getProfileData);

router.post('/signup', signUp) //Add check if email already exists in db

//router.put('/checkout/confirm');
//router.get('/orders', isLoggedIn, getAllOrdersByCustomerId);
//router.get('/orders/:orderId');
//router.put('/orders/:orderId');
//router.get('/products', getAllProducts);
//router.get('/products/:productId', getProductById);

module.exports = router;