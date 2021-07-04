`use strict`;

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const axios  = require('axios');
require('dotenv').config();

const server=express();

server.use(cors());

server.use(express.json());


PORT=process.env.PORT


mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true});

const diagmonSchema = new mongoose.Schema({
    name: String,
    img:String,
    level:String,
  });

  const pikemonModal = mongoose.model('pikemon', diagmonSchema);


server.get('/',(req,res)=>{
    res.send('home route')
})

server.get('/getDiagmons',getDiaHandler)
server.post('/addFavDia',addToFavHandler)
server.get('/getFav',getAddedtoFavHandler)
server.delete(`/deleteDiagmon/:id`,deleteDiagmonHandler)
server.put('/updatePoke/:id',updatepokeHandler)




function getDiaHandler (req,res){

axios.get('https://digimon-api.vercel.app/api/digimon').then(result=>{
    // console.log(result.data)
    res.send(result.data);
} )

}

function addToFavHandler (req,res){
    const {name,img,level}=req.body
    // console.log(req.body)
    const newPikemon = new pikemonModal({ 
        name: name,
        img:img,
        level:level
   });
// console.log(newPikemon)
newPikemon.save();
}

function getAddedtoFavHandler (req,res){

    pikemonModal.find({},(error,pikmonData)=>{
        res.send(pikmonData)
    }) 
}

function deleteDiagmonHandler (req,res){
    const id = req.params.id;
    
    pikemonModal.deleteOne({_id:id},(err,deletdData)=>{
        pikemonModal.find({},(err,data)=>{
            res.send(data)
        })
    })


    }

    function   updatepokeHandler (req,res){
    const id = req.params.id;
    const {name,img,level}=req.body;
    
    pikemonModal.findOne({_id:id},(err,myData)=>{
        console.log(req.body)
        myData.name=name;
        myData.img=img;
        myData.level=level;
        myData.save()
        .then(()=>{
            pikemonModal.find({},(err,data)=>{
                res.send(data)
            })
            

        })
    })
}

server.listen(PORT,()=>{
    console.log(`lisitning to PORT ${PORT}`)
})


