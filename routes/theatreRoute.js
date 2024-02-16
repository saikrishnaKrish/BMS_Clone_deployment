const router = require("express").Router();
const theatreModel = require("../models/theatreModel");
const showModel = require("../models/showModal");

//add theatre
router.post("/add", async (req, res) => {
  try {
    const theatre = await theatreModel(req.body);
    await theatre.save();
    res.status(201).json({
      success: true,
      message: "Theatre Created",
    });
  } catch (error) {
    console.log("error occurred", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server occurred",
    });
  }
});

//get theatre owner specific
router.get("/getAllTheatresByOwnerId/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const theatesList = await theatreModel.find({ owner: userId });
    return res.status(200).json({
        success:true,
        message:'Theatres fetched successfully',
        data:theatesList
    })
  } catch (error) {
    console.log("error occurred", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server occurred",
      data:error
    });
  }
});

 //get all unique theatres which have shows of a movie
// router.post('/getTheatresByMovieId',async (req,res)=>{
//       try{
//           const {movie,date} = req.body;
//           console.log("DATE",date,movie)
          
//           // const shows = await showModel.find({movie,date}).populate("theatre");
//           const shows = await showModel.find({ movie, date }).populate('theatres')
          
//           console.log("shows",shows,"DATE",date)
//             //get Unique Theatres 
//           let uniqueTheatres = [];
//           shows.forEach(()=>{
//             const theatre = uniqueTheatres.find((theatre)=>theatre._id === showModel.theatre._id);
//                 if(!theatre){
//                   const showForThisTheatre = shows.filter((showObj)=>showObj.theatre._id === showModel.theatre._id);
//                   uniqueTheatres.push({...showModel.theatre._doc,shows:showForThisTheatre}) 
//                 }
//           })
        
//        return res.status(200).json({
//             success:true,
//             data:uniqueTheatres,
//             message: "Theatres fetched successfully",
//           })

//       } catch(error){
//         console.log(error)
//         return res.status(500).json({
//           success: false,
//           message: "Internal Server occurred",
//           data:error
//         });
//       }
// })

router.post("/getTheatresByMovieId", async (req, res) => {

  try {
    const { movie, date } = req.body;
    console.log(movie,date)
    const shows = await showModel.find({ movie, date }).populate('movie').populate('theatre')

    // get unique theatres
    let uniqueTheatres = [];
    shows.forEach((show) => {
      const theatre = uniqueTheatres.find(
        (theatre) => theatre._id === show.theatre._id
      );

      if (!theatre) {
        const showsForThisTheatre = shows.filter(
          (showObj) => showObj.theatre._id === show.theatre._id
        );
        console.log(show)
        uniqueTheatres.push({
            ...show.theatre._doc,
            shows: showsForThisTheatre
        })
      }
    });
    console.log(uniqueTheatres)
    return res.send({
      success: true,
      message: "Theatres fetched successfully",
      data: uniqueTheatres,
    });
  } catch (error) {
    console.log(error)
   return res.send({
      success: false,
      message: "Something went wrong",
      data: error,
    });
  }
});

//get all theatres
router.get('/getAllTheatres',async (req,res)=>{
  try {
        const theatres =await theatreModel.find().populate('owner')
         return res.send({
          success:true,
          message:"Theatres fetched Successfully"
         })
  } 
  catch(error){
    return res.send({
      success:false,
      message:"something went wrong",
      data:error
    })
  }

})

//delete theatre
router.delete("/delete",async (req,res)=>{
    try{
        const theatreId = req.params.id;
       await theatreModel.findByIdAndDelete(theatreId);
       return res.status(200).json({
        success:true,
        message:'Theatre deleted successfully'
       }) 
    }
    catch (error) {
        console.log("error occurred", error);
        return res.status(500).json({
          success: false,
          message: "Internal Server occurred",
        });
    }
})

//update
router.put("/update",async (req,res)=>{
    // console.log(req.body.theatreId,req.body)
    try{
        const result= await theatreModel.findByIdAndUpdate(req.body.theatreId, req.body)
        console.log("result",result);
        return res.status(200).json({
            success:true,
            message:'Theatre updated successfully'
           }) 
    }
    catch (error) {
        console.log("error occurred", error);
        return res.status(500).json({
          success: false,
          message: "Internal Server occurred",
        });
    }
})





exports.router = router;