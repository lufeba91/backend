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
    const {date, customerId, address, paymentMethod, items} = req.body;
    const step1 = await pool.query('INSERT INTO orders (date, customer_id, address, payment_method) VALUES ($1,$2,$3,$4)',
    [date, customerId, address, paymentMethod]);
    const order_id = await pool.query('SELECT MAX(order_id) FROM orders').rows
    Object.keys(items).map((item) =>{
        pool.query('INSERT INTO orders_items (order_id, item_id, order_quantity) VALUES($1,$2,$3);',
        [order_id, item, items[item].quantity]);
    })
};

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
module.exports = {
    postOrder, 
    getAllProducts,
    getProductById,
    isUserRegistered,
    isOrderMine,
    signUp,
    pool};


