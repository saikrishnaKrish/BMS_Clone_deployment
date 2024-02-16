const router = require("express").Router();
const movieModel = require("../models/movieModel");

router.post("/add", async (req, res) => {
  try {
    const movie = new movieModel(req.body);
    await movie.save();
    res.status(201).json({
      success: true,
      message: "Movie created Successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
});


router.get("/getAllMovies", async (req, res) => {

  try {
    const movies = await movieModel.find();

    res.status(200).json({
      success: true,
      message: "movies fetched successfully!",
      data: movies,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error occurred",
    });
  }
});

router.get("/getMovieById/:movieId",async (req,res)=>{
  // console.log("joooooo",movieId)       
  console.log("first ddd")


  try{
      console.log("joooo")
        const movieId = req.params.movieId;
        const movie = await movieModel.findOne({_id:movieId})
        console.log(movieId);
        console.log(movie);

        res.status(200).json({
          success:true,
          message:"Movie fetched Successfully",
          data:movie
        })
    }
    catch(error){
      return res.status(500).json({
        success:false,
        message:"Internal Server Error!"
      })
    }
})
router.get('/test',async (req,res)=>{
  return res.status(200).json({
    success: true,
    message: "Internal server error occurred",
  });
})

router.delete("/delete/:id", async (req, res) => {
  try {
    const movieId= req.params.id;
    await movieModel.findByIdAndDelete(movieId);
    res.status(200).send({
      success: true,
      message: "Movie Deleted Successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server error occurred",
    });
  }
});

router.put("/update", async (req, res) => {
  try {
        await movieModel.findByIdAndUpdate(req.body.movieId,req.body);
            return res.status(200).json({
                success:true,
                message:'Movie updated successfully!'
            })        
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server error occurred",
    });
  }
});

exports.router = router;
