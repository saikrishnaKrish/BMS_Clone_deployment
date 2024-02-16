const mongoose = require('mongoose');

const headsetSchema = mongoose.Schema({
    modelName:{type:String,default:'OnEar',required:true},
    manufacturedDate:{type:Date,default:Date.now()},
    CompanyName:String,
    price:Number
})


const headsetModel = mongoose.model('headsets',headsetSchema);

async function createHeadset(){

    const newHeadset = new headsetModel({
        modelName:'600bt In-Ear',
        manufacturedDate:new Date('01/01/2024'),
        CompanyName:'JBL',
        price:800
    })

    const data = await newHeadset.save();
    console.log('headset created',data);
}

// createHeadset();
async function findHeadset(){
    const findHeadset = await headsetModel.find({CompanyName:'JBL'})
console.log('headesetFound',findHeadset);
}

console.log(findHeadset())
