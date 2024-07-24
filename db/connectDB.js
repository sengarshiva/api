const mongoose = require('mongoose')



const connectDB = () => {
    // return mongoose.connect(process.env.DB_URL)
    return mongoose.connect(process.env.DB_URL_LOCAL)
        .then((data) => {
            console.log(`mongodb connected with server:${data.connection.host}`);
        })
        .catch((error) => {
            console.log(error)
        })
}

module.exports =connectDB