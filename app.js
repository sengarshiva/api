const express = require('express')
const app = express()
const dotenv = require('dotenv')
const connectDB = require('./db/connectDB')
const api = require('./routes/api')
const fileUpload=require('express-fileupload')
const cookieParser = require("cookie-parser")



//token get
app.use(cookieParser());



//tempfiles uploaderz
app.use(fileUpload({useTempFiles:true}))
//data get
app.use(express.json())


dotenv.config({
    path: '.env'
})

connectDB()

//route load
//localhost:4000/api/
app.use('/api', api)




//server create
app.listen(process.env.PORT, () => {
    console.log(`localhost:${process.env.PORT}`)
})