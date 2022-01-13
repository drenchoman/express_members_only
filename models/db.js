const mongoose = require('mongoose');
const mongoDB = process.env.DB_URL;
const db = mongoose.connection;



exports.connectDB = async () => {
  mongoose.connect(mongoDB, {useUnifiedTopology: true, useNewUrlParser: true});
  db.on('error', console.error.bind(console, 'mongo connection error'));
}
