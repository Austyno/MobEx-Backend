const express = require('express');
const dotenv = require('dotenv');
const connectToDb = require('./config/db');
const errorHandler = require('./middleware/error');
// const cors = require('cors');




dotenv.config({ path: './config/config.env' });
connectToDb();


//Route files
const auth = require('./routes/auth');
const course = require('./routes/courses');
const reviews = require('./routes/reviews');
const profiles = require('./routes/profiles');



const app = express();

// app.use(cors());


// Body parser
app.use(express.json());

//Mount routes
app.use('/api/v1/auth', auth);
app.use('/api/v1/courses', course);
app.use('/api/v1/reviews', reviews);
app.use('/api/v1/profiles', profiles);

app.use(errorHandler);


const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`server running on ${PORT}`))

// process.on('unhandledRejection', (err,promise) => {
//     console.log(`Error : ${err.message}`);
//     // server.close(()=> process.exit(1))
// })
