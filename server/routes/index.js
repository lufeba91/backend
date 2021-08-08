const {Router} = require('express');
const router = Router();
const passport = require('passport');
const {
    postOrder, 
    getAllProducts,
    isUserRegistered,
    signUp,
    isAuth,
    getProfileData,
    getProductById} = require('../controllers/index.controllers');

router.get('/', (req,res) =>{
    res.send('Hello World');
});
router.get('/login',(req,res,next) =>{
    if(req.user) {
        res.redirect('/dashboard');
    }else {
        next();
    }
}, (req, res) =>{
    res.send('Please enter your email and password')
});
router.post('/login', passport.authenticate('local', {successRedirect: '/dashboard', failureRedirect: '/login-fail'}));
router.post('/signup', isUserRegistered, signUp);
router.get('/login-fail', (req,res) =>{
    res.send('Invalid username and/or password');
});
router.get('/dashboard', isAuth, getProfileData);
router.get('/logout', isAuth, (req, res) =>{
    req.logOut();
    res.redirect('/login');
})

//router.post('/checkout/confirm');
//router.get('/orders', isLoggedIn, getAllOrdersByCustomerId);
//router.get('/orders/:orderId');
//router.put('/orders/:orderId');
router.get('/products', getAllProducts);
router.get('/products/:productId', getProductById);

module.exports = router;