const express = require('express')
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser')
const morgan = require('morgan')
const dotenv = require('dotenv');
const connectDB = require('./config/db')
const openAiRoutes = require('./routes/openAiRoutes')
dotenv.config()// extracting the env variable

connectDB() // for database connection

// routes path
const authRoutes = require('./routes/authRoute');
const errorHandler = require('./middlewares/errorMiddleware');
app.use(cors({
    origin: process.env.FRONTEND_URL,
})) //resource sharing
app.use(express.json()) //allow to json parsing
app.use(bodyParser.urlencoded({ extended: false }))//convert the json to object 
app.use(morgan('dev'))//for log of request and response
app.use(errorHandler);

app.use("/api/v1/auth", authRoutes);
app.use("/api/openai", openAiRoutes)


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`server is running on port ${process.env.PORT}`)
})
