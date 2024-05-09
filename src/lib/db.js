const mysql = require('mysql2');

export const getDatabase = () => {
  const db = mysql.createConnection({
    multipleStatements: false,
    host     : '4.tcp.ngrok.io',
    port     : 11275,
    user     : 'root',
    password : 'MySQLPassword', //Not secure to store it this way; fill in yourself
    database : 'guestbook'
  });

  return db;
};

export const closeDBInstance = (db) => {
  db.end();
};