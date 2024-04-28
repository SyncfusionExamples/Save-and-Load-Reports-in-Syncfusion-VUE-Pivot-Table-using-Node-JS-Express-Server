var dboperations = require('./dboperations');
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
var router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use('/api', router);

router.route('/saveReport').post((request, response) => {
  let report = { ...request.body }
  console.log(report);
  dboperations.SaveReportToDB(report).then(data => {
    response.status(201).json(data);
  })
})

router.route('/removeReport').post((request, response) => {
  let report = { ...request.body }
  console.log(report);
  dboperations.RemoveReportFromDB(report).then(data => {
    response.status(201).json(data);
  })
})

router.route('/renameReport').post((request, response) => {
  let report = { ...request.body }
  console.log(report);
  dboperations.RenameReportInDB(report).then(data => {
    response.status(201).json(data);
  })
})

router.route('/fetchReport').post((request, response) => {
  dboperations.FetchReportListFromDB().then(data => {
    response.status(201).json(data);
  });
})

router.route('/loadReport').post((request, response) => {
  let report = { ...request.body }
  console.log(report);
  dboperations.LoadReportFromDB(report).then(data => {
    response.status(201).json(data);
  })
})

// Define the port for the server here.
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
