require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
const auth = require("./routes/auth.route")
const user = require('./routes/user.route')
const Meeting = require('./routes/meeting.route')
const AdminRoute = require('./routes/admin.route');
const Google = require('./routes/google.route');
const app = express();
const port = process.env.PORT;
const url = process.env.MONGOURL;
const path = require('path');

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.json());
app.use(cors());


mongoose.connect(url).then(()=> {
    console.log("DB connected");
}).catch((err)=> {
    console.log(err);
})

app.use("/auth", auth);
app.use('/user', user);
console.log("User route loaded");
app.use('/meeting', Meeting);
app.use('/admin', AdminRoute);
app.use('/', Google)

app.listen(port, '0.0.0.0', () => {
    console.log("server started @ 5000");
})

