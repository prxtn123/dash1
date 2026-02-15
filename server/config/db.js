 const mysql=require('mysql');

 const db = mysql.createConnection({
   host: process.env.DB_HOST || "localhost",
   user: process.env.DB_USER || "root",
   password: process.env.DB_PASSWORD || "",
   port: process.env.DB_PORT || "3306",
   database: process.env.DB_NAME || "cam_sur"
 });
 db.connect(function(err){
   if(err){
     console.error('Database connection failed:'+ err.stack);
     return;
   }
   console.log("DataBase connected");
 })

module.exports = db;
