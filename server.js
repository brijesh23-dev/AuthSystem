const app = require('./src/app');
const connectTodb = require('./src/db/database.js');

const PORT = process.env.PORT ||3000;

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    connectTodb();
})