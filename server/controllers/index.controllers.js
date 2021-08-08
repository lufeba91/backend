require('dotenv').config();
const { response } = require('express');
const {Pool} = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT,
    host: process.env.DBHOST
});


const postOrder = async (req, res) => {
    //items is an object {'1':{itemId: 1, quantity: 2}, {}... }
    const {date, address, paymentMethod, items} = req.body;
    const customerId = await (await pool.query('SELECT customer_id FROM customers WHERE email=$1',[req.user.email])).rows[0].customer_id;
    const step1 = await pool.query('INSERT INTO orders (date, customer_id, address, payment_method) VALUES ($1,$2,$3,$4)',
    [date, customerId, address, paymentMethod]);
    const orderidQuery = await pool.query('SELECT MAX(order_id) FROM orders');
    const orderId = orderidQuery.rows[0].max;
    Object.keys(items).map((item) =>{
        pool.query('INSERT INTO orders_items (order_id, item_id, order_quantity) VALUES($1,$2,$3);',
        [orderId, item, items[item].quantity]);
    });
    res.status(201).redirect('/orders/'+orderId);
};

const getAllProducts = async (req, res) =>{
    const response = await pool.query('SELECT description, price, picture FROM items_data');
    res.send(response.rows);
}

const getProductById = async (req, res) =>{
    const productId = req.params.productId;
    const response = await pool.query('SELECT description, price, picture, quantity FROM items_data WHERE item_id = $1', [productId]);
    if (response.rows.length === 0 ) {
        res.status(404).send('Not found');
    }
    res.send(response.rows);
}

const isOrderMine = async (req, res, next) =>{
}

const signUp = async (req, res) =>{
    const {email, password, firstName, lastName, defaultAddress} = req.body;
    const saltRounds = parseInt(process.env.saltRounds);
    const hash = await bcrypt.hash(password, saltRounds);
    await pool.query('INSERT INTO customers (first_name, last_name, email, default_address) VALUES ($1, $2, $3, $4)', [firstName, lastName, email, defaultAddress]); 
    await pool.query('INSERT INTO login (email, pwhash) VALUES ($1, $2)', [email, hash])
    res.status(201).send('Success');
}

const isUserRegistered = async (req, res, next) =>{
    const {email} = req.body;
    const response = await pool.query('SELECT email FROM login WHERE email=$1', [email]);
    if (response.rows.length > 0) {
        res.status(401).send('User already registered. Please log in');
    } else {
    next();
    }
}

const isAuth = (req, res, next) =>{
    if(req.isAuthenticated()) {
        next();
    } else {
        res.status(401).redirect('/login')
    }
}

const getProfileData = async (req, res) =>{
    
    const response = await pool.query('SELECT customer_id, first_name, last_name, email, default_address FROM customers WHERE email=$1', [req.user.email]);
    res.send(response.rows);

}

const getAllOrdersByCustomerId = async (req, res) => {
    const email = req.user.email;
    console.log(email)
    const response = await pool.query('SELECT * FROM orders WHERE customer_id=(SELECT customer_id FROM customers WHERE email=$1);', [email]);
    if (response.rows.length < 1) {
        res.send('There are no orders yet');
    } else {
        res.send(response.rows);
    }
}

const authView = async (req, res, next) =>{
    const orderId = req.params.orderId;
    const customerquery = await pool.query('SELECT customer_id FROM orders WHERE order_id=$1',[orderId]);
    if (customerquery.rows.length ===0) {
        res.status(404).send('Not found');
    }
    const customerId = customerquery.rows[0].customer_id;
    const IdQuery = await pool.query('SELECT customer_id FROM customers WHERE email=$1', [req.user.email]);
    const myId = IdQuery.rows[0].customer_id;
    if (myId === customerId){
        next();
    }else {
        res.status(403).send('Unauthorized Access');
    }
}

const getOrderById = async (req, res) =>{
    const orderId = req.params.orderId;
    const response = await pool.query('SELECT description, price, order_quantity FROM items_data JOIN orders_items ON orders_items.item_id = items_data.item_id WHERE order_id=$1;',[orderId]);
    res.send(response.rows);
}

module.exports = {
    postOrder, 
    getAllProducts,
    getProductById,
    getProfileData,
    isUserRegistered,
    isOrderMine,
    signUp,
    isAuth,
    getAllOrdersByCustomerId,
    authView,
    getOrderById,
    pool};


