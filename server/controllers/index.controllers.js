require('dotenv').config();
const { response } = require('express');
const {Pool} = require('pg');
const {saltHashPasword, sha512} = require('../../utils/password-store');


const pool = new Pool({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT,
    host: process.env.DBHOST
});


const postOrder = async (req, res) => {
    //items is an object {'1':{itemId: 1, quantity: 2}, {}... }
    const {date, customerId, address, paymentMethod, items} = req.body;
    const step1 = await pool.query('INSERT INTO orders (date, customer_id, address, payment_method) VALUES ($1,$2,$3,$4)',
    [date, customerId, address, paymentMethod]);
    const order_id = await pool.query('SELECT MAX(order_id) FROM orders').rows
    Object.keys(items).map((item) =>{
        pool.query('INSERT INTO orders_items (order_id, item_id, order_quantity) VALUES($1,$2,$3);',
        [order_id, item, items[item].quantity]);
    })
};
/*
const signUp = async (req, res) => {
    const {email, password} =req.body;
    const {salt, paswordHash } = saltHashPasword(email, password);
    await pool.query('INSERT INTO login (email, salt, pwhash) VALUES ($1, $2, $3)', [email, salt, paswordHash]);
    res.status(201).redirect('/dashboard')

}

const checkLogin = async (req, res) => {
    const {email, password} = req.body;
    
    const response = await pool.query('SELECT salt, pwhash FROM login WHERE email = $1', [email]);
    if (response.rows.length === 0 ) {
        res.status(401).redirect('/login'); 
    }
    const salt = response.rows[0].salt;
    const real = response.rows[0].pwhash;
    const attempt = sha512(password, salt).paswordHash;
    if (real === attempt ) {
        res.status(200).redirect('/dashboard');
    } else {
        res.status(401).redirect('/login');
    }
    
}

const isSignedUp = async (req, res, next) => {
    const {email} = req.body;
    response = await pool.query('SELECT email from login WHERE email = $1', [email]);
    if (response) {
        res.status(200).redirect('/login'); //User already registered, must log in
    } else {
        next();
    }
}
*/
const getProfileData = async (req, res) =>{
  //How do I get my Id??  
}

const getAllOrdersByCustomerId = async (req, res) => {//needs fixing. Customer ID can not be provided by body
    const {customerId} = req.body;
    const response = await pool.query('SELECT date, address, payment_method FROM orders WHERE customer_id = $1', [customerId]);
    if (!response){
        res.status(404).send();
    }
    res.status(200).send(response.rows);

}

const getOrderById = async (req, res) => {
    const orderId = req.params.orderId;
    const response = await pool.query('SELECT order_quantity, description, price FROM orders_items JOIN items_data ON orders_items.item_id = items_data.item_id WHERE order_id = $1;', [orderId]);
    if (!response) {
        res.status(404).send();
    }
    res.status(200).send(response.rows);
}

const getAllProducts = async (req, res) =>{
    response = await pool.query('SELECT description, price, picture FROM items_data');
    res.send(response.rows);
}

const getProductById = async (req, res) =>{
    const productId = req.params.productId;
    const response = await pool.query('SELECT description, price, picture, quantity FROM items_data WHERE item_id = $1', [productId]);
    if (!response) {
        res.status(404).send();
    }
    
    res.send(response.rows);

}

const isOrderMine = async (req, res, next) =>{
    const customerId
}

module.exports = {
    getAllOrdersByCustomerId, 
    postOrder, 
    checkLogin, 
    signUp, 
    isSignedUp,
    getProfileData,
    getAllProducts,
    getProductById,
    getOrderById,
    isOrderMine,
    pool};


