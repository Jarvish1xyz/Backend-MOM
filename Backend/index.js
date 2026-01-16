require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
const auth = require("./routes/auth.route")
const profile = require('./routes/user.route')
const Meeting = require('./routes/meeting.route')
const app = express();
const port = process.env.PORT;
const url = process.env.MONGOURL;

app.use(express.json());
app.use(cors());


mongoose.connect(url).then(()=> {
    console.log("DB connected");
}).catch((err)=> {
    console.log(err);
})

app.use("/auth", auth);
app.use('/user', profile);
app.use('/meeting', Meeting);

app.listen(port, () => {
    console.log("server started @ 5000");
})

