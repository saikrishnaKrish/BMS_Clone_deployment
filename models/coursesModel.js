const { default: mongoose } = require("mongoose");

const courseSchema = new mongoose.Schema({
    name:String,
    creator:String,
    publisher:{type:Date,default:Date.now()},
    isPublished:Boolean,
    rating:Number
})


const course = mongoose.model('Course',courseSchema);

async function createCourse(){
    const newCourse = new course({
        name:'Mern FullStack',
        creator:'sai krishna',
        isPublished:true,
        rating:4.8
    })
    
   const courseCreated=  await newCourse.save();
   console.log(courseCreated);
}

// const courseCreated = createCourse();
// console.log(courseCreated)

// async function findCourses(){
//     const getCourse = await course.find({ creator: 'sai krishna'});
//     console.log(getCourse);
// }

// findCourses()