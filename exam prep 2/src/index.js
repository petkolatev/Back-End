import express from 'express';
import handlebars from 'express-handlebars'
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import 'dotenv/config'

import routes from './routes.js';
import { authMiddleware } from './middlewares/authMiddleware.js';

const app = express();

// setup DB
const url = 'mongodb://localhost:27017';
mongoose.connect(url,{dbName: 'games'})  // Change dbname with actual project name
.then(()=> console.log('DB connected!'))
.catch((err)=> console.log(`DB fail to connected: ${err}`))

//setup view engine
app.engine('hbs', handlebars.engine({
    extname: 'hbs'
}))
app.set('views', 'src/views')
app.set('view engine', 'hbs')

// setup express
app.use('/static', express.static('src/public'))
app.use(express.urlencoded({ extended: false })) //we can read from body
app.use(cookieParser())
app.use(authMiddleware)
app.use(routes)

app.listen(3000, () => console.log('Server is running on http:/localhost:3000 '));