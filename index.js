const express = require("express");
const path = require("path");
const axios = require("axios");
// const Chart = require("chart.js");

// const dotenv = require("dotenv");
// dotenv.config();

const pageRouter = require("./modules/router");

const app = express();
const port = process.env.PORT || 3030;

app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "pug");

app.use(express.json());

app.use ("/", pageRouter);

app.listen(port, () => {
    console.log( `Listening on ${port}`);
});

app.post("/getNews", (request, response) => {
    const symbol = request.body.symbol;

    const apiUrl = "https://api.marketaux.com/v1/news/all";
    const filterEntities = true;
    const language = "en";
    const apiToken = "RhIgNFnjlHV2bl4csmPbZfpeiTZaXkvI7sxegpr9";

    const requestUrl = `${apiUrl}?symbols=${symbol}&filter_entities=${filterEntities}&language=${language}&api_token=${apiToken}`;

    axios.get(requestUrl)
        .then(apiResponse => {
            // Handle Successful Response
            const newsData = apiResponse.data;
            response.json(newsData);
            console.log("Response:", newsData);
        })
        .catch(error => {
            // Handle Error
            console.log("Error fetching data:", error);
            response.status(500).json({ error: "Error fetching data" });
        });
});

app.post("/getStockInfo", (request, response) => {
    const symbol = request.body.symbol;

    const apiUrl = "https://www.alphavantage.co/query?function=";
    const timeSeries = "TIME_SERIES_MONTHLY";
    const apiToken = "0HG79JYA3HRUVGRD";

    const requestUrl = `${apiUrl}${timeSeries}&symbol=${symbol}&apikey=${apiToken}`;

    axios.get(requestUrl)
        .then(apiResponse => {
            // Handle Successful Response
            const stockData = apiResponse.data;
            response.json(stockData);
            console.log("Response:", stockData);
        })
        .catch(error => {
            // Handle Error
            console.log("Error fetching data:", error);
            response.status(500).json({ error: "Error fetching data" });
        });
});