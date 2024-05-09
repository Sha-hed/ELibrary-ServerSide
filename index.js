const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000


app.use(cors())
app.use(express.json())

app.get('/', async(req,res)=>{
    res.send('We are Heading Towards completing Assignment-11')
})

app.listen(port, ()=>{
    console.log(`Our backend Server is running for assignment on Port : ${port}`)
})