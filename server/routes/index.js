const {Router} = require('express');
const router = Router();
const {
    postOrder, 
    getAllProducts,
    isUserRegistered,
    signUp,
    getProductById} = require('../controllers/index.controllers');

router.get('/', (req,res) =>{
    res.send('Hello World');
})

router.post('/signup', isUserRegistered, signUp);
//router.post('/login', checkLogin);
//router.get('/dashboard', isLoggedIn, getProfileData);

//router.post('/checkout/confirm');
//router.get('/orders', isLoggedIn, getAllOrdersByCustomerId);
//router.get('/orders/:orderId');
//router.put('/orders/:orderId');
router.get('/products', getAllProducts);
router.get('/products/:productId', getProductById);

module.exports = router;