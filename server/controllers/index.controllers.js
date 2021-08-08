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
}

const signUp = async (req, res) =>{
    const {email, password, firstName, lastName, defaultAddress} = req.body;
    const saltRounds = parseInt(process.env.saltRounds);
    const hash = await bcrypt.hash(password, saltRounds);
    await pool.query('INSERT INTO customers (first_name, last_name, email, default_address) VALUES ($1, $2, $3, $4)', [firstName, lastName, email, defaultAddress]); 
    await pool.query('INSERT INTO login (email, pwhash) VALUES ($1, $2)', [email, hash])
    res.status(201).send('Success');
}

module.exports = {
    getAllOrdersByCustomerId, 
    postOrder, 
    getProfileData,
    getAllProducts,
    getProductById,
    getOrderById,
    isOrderMine,
    signUp,
    pool};


