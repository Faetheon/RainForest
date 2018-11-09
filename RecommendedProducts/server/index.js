require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const cors = require('cors');

const environment = process.env.NODE_ENV || 'development';
const configuration = require(__dirname + '/../knexfile.js')[environment];
const database = require('knex')(configuration);
const rpUrl = process.env.RECOMMENDED_PRODUCTS_URL;
const dbUrl = process.env.DB_URL;

const sequelizeP = new Sequelize(rpUrl, {
  dialect: 'postgres'
});

const sequelizeV = new Sequelize(dbUrl, {
  dialect: 'postgres',
  ssl: true
});

const app = express();
const PORT = 3001;

app.use(express.static(__dirname + '/../react-client/dist'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/products', (req, res) => {
  sequelizeP.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    })
    .catch(err => {
      console.error('Unable to connect to the database: ', err);
      res.status(500).send();
    });
    sequelizeP.query('SELECT * FROM products ORDER BY id', {type: sequelizeP.QueryTypes.SELECT})
    .then(data => {
      res.status(200).send(JSON.stringify(data));
    })
    .catch(err => {
      if (err) throw err;
    });
});

app.get('/api/reviews', (req, res) => {
  database('customer_review').select()
    .then(reviews => {
      res.status(200).json(reviews);
    })
    .catch(err => {
      res.status(500).json({
        error
      });
    });
});

app.get('/api/reviews/:productid', (req, res) => {
  let productid = req.params.productid;
  database('customer_review').where({
      product_id: productid
    }).orderBy('helpful_count', 'desc').limit(10).select()
    .then(reviews => {
      res.status(200).json(reviews);
    })
    .catch(error => {
      res.status(500).json({
        error
      });
    });
});

app.get('/api/images', (req, res) => {
  database('customer_review_images').select()
    .then(images => {
      res.status(200).json(images);
    })
    .catch(err => {
      res.status(500).json({
        err
      });
    });
});

app.get('/api/images/reviewId', (req, res) => {
  let reviewId = req.params.reviewId;
  database('customer_review_images').where({
      review_id: reviewId
    }).select()
    .then(images => {
      res.status(200).json(images);
    })
    .catch(err => {
      res.status(500).json({
        err
      });
    });
});

app.get('/productsdisplay', (req, res) => {
  let productID = req.query.id;
  sequelizeV.query(`SELECT * FROM products WHERE id=${productID};`, {
    type: sequelizeV.QueryTypes.SELECT
  })
  .then(data => {
    res.status(200).json(data);
  })
  .catch(err => {
    console.log(err);
    releaseEvents.status(500).json(error);
  });
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});