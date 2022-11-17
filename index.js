const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ema-jhon.tdrez6m.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async()=>{
  try{
    await client.connect();
    const productCollection = client.db("emaJhon").collection("products");

    app.get('/products',async(req,res)=>{
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      const cursor = productCollection.find({});
      let products ;
      if(page || size){
        products = await cursor.skip(page*size).limit(size).toArray();
      }else{
        products = await cursor.toArray();
      }
      res.json(products);
    })
    app.get('/productsCount',async(req,res)=>{
      const count = await productCollection.estimatedDocumentCount();
      res.json({count});
    })
    app.post('/products-by-keys',async(req,res)=>{
      const keys = req.body;
      const ids = keys.map(id=> ObjectId(id))
      const query = {_id:{$in:ids}}
      const cursor = productCollection.find(query);
      const products = await cursor.toArray();
      res.json(products)

    })
  }finally{}
}
run().catch(console.dir)

















app.get('/',(req,res)=>{
    res.send('Ema Jhon Server is Running........')
})

app.listen(port,()=>{
    console.log(`Server Running on port ${port}`);
})