const shortid = require("shortid"); 
const URL=require('../models/url')

async function handleGenerateNewShortURL(req,res){
    const body=req.body;
    if(!body.url) return res.status(400).json({error:'url is required'});
     console.log("BODY: ", body)
  const shortID=shortid();
  try{
  await URL.create({
    shortId:shortID,
    redirectURL:body.url,
    visitHistory:[],
    createdBy:req.user._id
  });
  const  allurls=await URL.find({createdBy:req.user._id});
return res.render("home", {
  id: shortID,
  urls:allurls,
});

  // return res.json({id:shortID});
} catch (error) {
        console.error("Mongoose Create Error:", error);  
        return res.status(500).json({ error: 'Internal Server Error' });
    }}

async function handleGetAnalytics(req,res){
  const shortId=req.params.shortId;
  const result=await URL.findOne({shortId})
  return res.json({totalClicks:result.visitHistory.length,analytics:result.visitHistory,})
}

module.exports={handleGenerateNewShortURL,handleGetAnalytics}