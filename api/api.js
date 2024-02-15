const express = require('express');
const cors = require('cors');
const postalCodesApi = require('./postalCodesApi');
const facilitiesApi = require('./facilitiesApi');
const employeesApi = require('./employeesApi');
const employmentsApi = require('./employmentsApi');
const managersApi = require('./managersApi');
const vaccinesApi = require('./vaccinesApi');
const infectionsApi = require('./infectionsAPi');
const schedulesApi = require('./schedulesApi');
const emailLogsApi = require('./emailLogsApi');
const queriesApi = require('./queriesApi');

const app = express();
const port = 4000;

// Enable CORS for all routes
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/postalCodesApi", postalCodesApi);
app.use("/facilitiesApi", facilitiesApi);
app.use("/employeesApi", employeesApi);
app.use("/employmentsApi", employmentsApi);
app.use("/managersApi", managersApi);
app.use("/vaccinesApi", vaccinesApi);
app.use("/infectionsApi", infectionsApi);
app.use("/schedulesApi", schedulesApi);
app.use("/emailLogsApi", emailLogsApi);
app.use("/queriesApi", queriesApi);


app.listen(port, () => {
  console.log(`API Listening on port ${port}`);
});