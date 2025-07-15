const express=require("express")
const path=require('path')
const cookieParser = require('cookie-parser'); 
const{connectToMongoDB}=require('./connect')
const{restrictToLoggedinUserOnly,checkAuth}=require('./middleware/auth')

const URL = require('./models/url')

const urlRoute=require("./routes/url")
const staticRoute=require('./routes/staticRouter')
const userRoute=require('./routes/user')
const app=express();
const PORT=8001;
app.use(express.json()); //accepts json data
app.use(express.urlencoded({extended:false})) //and accepts form's data too
app.use(cookieParser())


app.use("/url" ,restrictToLoggedinUserOnly,urlRoute)
app.use("/user",userRoute)
app.use("/", checkAuth,staticRoute)
app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;

    const entry = await URL.findOneAndUpdate(
        { shortId },
        {
            $push: {
                visitHistory: {
                    timestamp: Date.now(), // typo: 'timestamps' → should be 'timestamp'
                },
            },
        }
    );

    if (!entry) {
        return res.status(404).send("Short URL not found");
    }

    res.redirect(entry.redirectURL);
});


connectToMongoDB("mongodb://localhost:27017/short-url")
.then(()=>console.log("MONGODB CONNECTED !"))
app.set("view engine","ejs")
app.set('views',path.resolve("./views"))


app.listen(PORT,()=> console.log(`Server Started at PORT:${PORT}`))