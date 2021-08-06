const {Router} = require('express');
const router = Router();
const {
    getAllOrdersByCustomerId, 
    postOrder, 
    checkLogin, 
    signUp, 
    isSignedUp,
    getProfileData,
    getAllProducts,
    getProductById} = require('../controllers/index.controllers');
router.post('/signup', isSignedUp,signUp);
router.get('/login', checkLogin);
//router.get('/dashboard', isLoggedIn, getProfileData);



//router.put('/checkout/confirm');
//router.get('/orders', isLoggedIn, getAllOrdersByCustomerId);
//router.get('/orders/:orderId');
//router.put('/orders/:orderId');
router.get('/products', getAllProducts);
router.get('/products/:productId', getProductById);

module.exports = router;