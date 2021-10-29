import express from 'express';
import env from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'

const app = express()
env.config({path: '.env.local'})

const port = process.env.PORT || process.env.port

app.use(express.json({extended: true}))
app.use(express.urlencoded({extended: true}))
app.use(cors())

mongoose.connect(process.env.mongodb).then(() => console.log(`App listening at http://localhost:${port}`)).catch(err => console.log(err));

app.listen(port, (error) => {
    if (error) {
        return console.log(error);
    }
});

app.get('/', async (request, response) => {
    response.send('Welcome')
})