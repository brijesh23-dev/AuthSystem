const mongoose = require('mongoose');
const config = require('./config')
const  onnectTodb = ()=>{
    mongoose.connect(config.MONGO_URI)
    .then(()=>console.log('Connected to DB'))
    .catch((err)=>console.log('Error connecting to DB',err))
}

module.exports = onnectTodb;