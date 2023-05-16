require('dotenv').config()

module.exports={
  "development": {
    "username": process.env.DATABASE_USERNAME,
    "password": process.env.DATABASE_PASSWORD,
    "database": process.env.DATABASE_DATABASE,
    "host": process.env.DATABASE_HOST, 
    "dialect": "postgres"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": process.env.PROD_DATABASE_USERNAME,
    "password": process.env.PROD_DATABASE_PASSWORD,
    "database": process.env.PROD_DATABASE_DATABASE,
    "host": process.env.PROD_DATABASE_HOST,
    "dialect": "postgres"
  }
}
