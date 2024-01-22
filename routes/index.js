require('dotenv').config();
let knex = require('knex');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Client } = require('pg');
const client = new Client();
const express = require('express');
const app = express();
const router = new express.Router();


const PORT = process.env.PORT || 9999;

app.use(bodyParser.json());
app.use(cors());

app.listen(PORT, async () => {
  console.log('server started! port: ', PORT);

  try {
    const database = knex({
      client: 'pg',
      connection: {
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
      },
      searchPath: ['knex', 'public'],
      pool: {
        max: 10,
        min: 2,
        afterCreate: (conn, done) => {
          console.log(database().select('*').from('questions'));
          conn.query('SELECT * FROM questions', (err) => {
            console.log('select err', err);

            if(err) {
              done(err, conn);
            } else {
              console.log(conn);
            }
          });
        }
      },

    });
  } catch (e) {
    console.log('err 228', e);
  } finally {
    console.log('finally');
  }
})

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
