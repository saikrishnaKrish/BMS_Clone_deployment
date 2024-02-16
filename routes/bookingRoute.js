
const router  = require("express").Router();
const stripe = require("stripe")(process.env.stripe_key)
const bookingSchema = require("../models/bookingModel");
const showSchema = require("../models/showModal");
const authmiddleware = require("../middlewares/authmiddleware");

//for US
// router.post('/makePayment', async (req,res)=>{
//     try {
//         const {token,amount} = req.body;
//         console.log("token",token);

//         console.log("email",token.email)
//         const customer = await stripe.customers.create({
//             email:token.email,
//             source:token.id
//         })
//         const charge = await stripe.charges.create({
//             amount:amount,
//             currency:"usd",
//             customer:customer.id,
//             receipt_email:token.email,
//             description:"Ticket has been booked for a movie"
//         })
//         const transactionId = charge.id;

//         res.send({
//             success:true,
//             message:"Payment done, Ticket booked",
//             data:transactionId
//         })

//     }
//     catch(error){
//             res.send({
//                 success:false,
//                 message:error.message
//             })
//     }
// })


//for India
router.post('/makePayment', async (req, res) => {
    try {
        const { token, amount } = req.body;

        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id
        });

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Stripe uses amounts in cents, so multiply by 100
            currency: 'inr', // Indian Rupee
            customer: customer.id,
            receipt_email: token.email,
            description: 'Ticket has been booked for a movie'
        });

        const transactionId = paymentIntent.id;

        res.send({
            success: true,
            message: 'Payment done, Ticket booked',
            data: transactionId
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
});

//book shows
router.post("/bookShow",authmiddleware,async (req,res)=>{
        try{
                //save booking
                const newBooking = new bookingSchema(req.body);
                await newBooking.save();

                const show = await showSchema.findById(req.body.show);
                //update seats
                await showSchema.findByIdAndUpdate(req.body.show,{
                    bookedSeats:[...show.bookedSeats,...req.body.seats]
                })
                
                res.send({
                    success:true,
                    message:"Show booked successfully"
                })
        }
        catch(error){
            res.send({
                success:true,
                message:error.message
            })
        }
})


router.get("/getBookings" , authmiddleware, async (req,res)=>{

    console.log("req body userID",req.body)

    try{
        const bookings = await bookingSchema.find({user:req.body.userId})
        .populate("user")
        .populate("show")
        .populate({
                path:"show",
                populate:{
                    path:"movie",
                    model:"movies"
                }
        })
        .populate({
            path:"show",
            populate:{
                path:"theatre",
                model:"theatres",
            }
        });
            console.log(bookings)
            res.send({
                success:true,
                message:"Bookings fetched successfully",
                data:bookings
            })
    }
    catch(error){
        console.log("error",error)
            res.send({
                success:false,
                message:error.message
            })
    }
})


exports.router = router