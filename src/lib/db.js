const mysql = require('mysql2');

export const getDatabase = () => {
  const db = mysql.createConnection({
    multipleStatements: false,
    host     : '2.tcp.ngrok.io',
    port     : 10995,
    user     : '396user',
    password : '396user', //Not secure to store it this way; fill in yourself
    database : 'guestbook'
  });

  return db;
};

export const closeDBInstance = (db) => {
  db.end();
};