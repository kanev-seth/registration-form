const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");


const app = express(); 
dotenv.config();

const port = process.env.PORT || 3000;  //the port at which we want to run our code.

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;   //to take data from a dotenv file, the syntax is process.env.

//Connecting MongoDB:
mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.oe0ydbv.mongodb.net/registrationFormDB`, {
    useNewUrlParser : true,
    useUnifiedTopology : true,
});

//Registration Schema:
const registrationSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String
});//Schema is the design of the form data that we will store.

//Making a module using our schema:
const Registration = mongoose.model("Registration", registrationSchema);   //The function mongoose.model creates a model of the schema that we created. After which we can add data to this model.

//using body-parser: body-parser converts the form data entered by the user into a readable format from an originally complex format.
app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json()); //converts the file into a json format, its not very important to use this.

//Making a GET Request:
app.get("/", (req, res)=>{
    res.sendFile(__dirname + "/index.html");
})

app.post("/register", async (req, res)=>{
    try{
        const {name, email, password} = req.body; //storing the data from the client in a variable.

        //checking if the user already exists:
        const existingUser = await Registration.findOne({email : email});
        if(!existingUser){
            const registrationData = new Registration({
                name,
                email,
                password
            });//saving the data fetched from form in MongoDB.
            await registrationData.save(); //await keyword waits for registrationData.save until it runs completely.
            res.redirect("/success"); //after the data is saved in the MongoDB, we will redirect the page in response.
        }
        else{
            console.log("User already exists.");
            res.redirect("/error");
        }
        

        
    }
    catch (error){
        console.log(error);
        res.redirect("error");
    }
})

//handling the success route: 
app.get("/success", (req, res)=>{
    res.sendFile(__dirname+"/success.html");
})
//handling the error route:
app.get("/error", (req, res)=>{
    res.sendFile(__dirname+"/error.html");
})

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
}) // app.listen is used to run our node.js code. This type of quotes are called BACKTICK which is on top of tab.

//Making our MongoDB username and password:-