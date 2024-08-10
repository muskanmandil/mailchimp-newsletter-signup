const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const app = express();
require('dotenv').config()

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", (req, res) => {
    const fName = req.body.fName;
    const lName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fName,
                    LNAME: lName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const username = process.env.MAILCHIMP_USERNAME;
    const apiKey = process.env.MAILCHIMP_API_KEY;
    const baseUrl = process.env.MAILCHIMP_URL
    const list_id = process.env.MAILCHIMP_LIST_ID;
    const url = `${baseUrl}/lists/${list_id}`;
    const options = {
        auth: `${username}:${apiKey}`,
        method: "POST"
    }

    const request = https.request(url, options, (response) => {
        response.on("data", (data) => {
            console.log(JSON.parse(data));
        })

        if(response.statusCode===200){
            res.sendFile(__dirname + "/success.html");
        }else{
            res.sendFile(__dirname + "/failure.html");
        }
    });

    request.write(jsonData);
    request.end();
})

app.post("/failure", (req,res)=>{
    res.redirect("/");
})

app.listen(3000, () => {
    console.log("server is running on port: 3000");
})