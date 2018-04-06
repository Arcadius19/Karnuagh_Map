const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

function handleError(res, reason, message, code) {
  console.log('ERROR: ' + reason);
  res.status(code || 500).send({'error': message});
}

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

pool.query('CREATE TABLE IF NOT EXISTS Feedback(' +
  'id               SERIAL      PRIMARY KEY, ' +
  'submissionTime   TIMESTAMP, ' +
  'rating           SMALLINT    CHECK (rating >= 1 AND rating <= 5), ' +
  'comment          VARCHAR(1000));', (err, res) => {
  if (err) {
    console.log("ERROR: Failed to create a table Feedback. " + err.message)
  } else {
    console.log('Table Feedback created or already in database.');
  }
});

pool.query('CREATE TABLE IF NOT EXISTS UTPersonal(' +
  'id               SERIAL PRIMARY KEY, ' +
  'submissionTime   TIMESTAMP, ' +
  'isStudent        BOOLEAN, ' +
  'tookCourse       BOOLEAN, ' +
  'kmapHear        BOOLEAN, ' +
  'kmapUse          BOOLEAN);', (err, res) => {
  if (err) {
    console.log("ERROR: Failed to create a table UTPersonal. " + err.message)
  } else {
    console.log('Table UTPersonal created or already in database.');
  }
});

pool.query('CREATE TABLE IF NOT EXISTS UTGeneral(' +
  'id               INT         REFERENCES UTPersonal(id), ' +
  'navigation       SMALLINT    CHECK (navigation >= 1 AND navigation <= 5), ' +
  'beneficial       SMALLINT    CHECK (beneficial >= 1 AND beneficial <= 5), ' +
  'rating           SMALLINT    CHECK (rating >= 1 AND rating <= 5), ' +
  'comment          VARCHAR(1000));', (err, res) => {
  if (err) {
    console.log("ERROR: Failed to create a table UTGeneral. " + err.message)
  } else {
    console.log('Table UTGeneral created or already in database.');
  }
});


pool.query('CREATE TABLE IF NOT EXISTS UTTask1(' +
  'id                   INT         REFERENCES UTPersonal(id), ' +
  'navigationEasy       SMALLINT    CHECK (navigationEasy >= 1 AND navigationEasy <= 5), ' +
  'feedbackInformative  SMALLINT    CHECK (feedbackInformative >= 1 AND feedbackInformative <= 5), ' +
  'comment              VARCHAR(1000));', (err, res) => {
  if (err) {
    console.log("ERROR: Failed to create a table UTTask1. " + err.message)
  } else {
    console.log('Table UTTask1 created or already in database.');
  }
});

pool.query('CREATE TABLE IF NOT EXISTS UTTask2(' +
  'id                   INT         REFERENCES UTPersonal(id), ' +
  'labelSquares         SMALLINT    CHECK (labelSquares >= 1 AND labelSquares <= 5), ' +
  'exprToKmap           SMALLINT    CHECK (exprToKmap >= 1 AND exprToKmap <= 5), ' +
  'findBestGroups       SMALLINT    CHECK (findBestGroups >= 1 AND findBestGroups <= 5), ' +
  'nameGroup            SMALLINT    CHECK (nameGroup >= 1 AND nameGroup <= 5), ' +
  'kmapToExpr           SMALLINT    CHECK (kmapToExpr >= 1 AND kmapToExpr <= 5), ' +
  'minimiseExpr         SMALLINT    CHECK (minimiseExpr >= 1 AND minimiseExpr <= 5));', (err, res) => {
  if (err) {
    console.log("ERROR: Failed to create a table UTTask2. " + err.message)
  } else {
    console.log('Table UTTask2 created or already in database.');
  }
});

pool.query('CREATE TABLE IF NOT EXISTS UTTask3(' +
  'id                   INT         REFERENCES UTPersonal(id), ' +
  'informativePoints    SMALLINT    CHECK (informativePoints >= 1 AND informativePoints <= 5), ' +
  'progress             SMALLINT    CHECK (progress >= 1 AND progress <= 5), ' +
  'reset                SMALLINT    CHECK (reset >= 1 AND reset <= 5), ' +
  'comment              VARCHAR(1000));', (err, res) => {
  if (err) {
    console.log("ERROR: Failed to create a table UTTask3. " + err.message)
  } else {
    console.log('Table UTTask3 created or already in database.');
  }
});

pool.query('CREATE TABLE IF NOT EXISTS UTTask4(' +
  'id            INT         REFERENCES UTPersonal(id), ' +
  'navigation    SMALLINT    CHECK (navigation >= 1 AND navigation <= 5), ' +
  'syntax        SMALLINT    CHECK (syntax >= 1 AND syntax <= 5), ' +
  'parameters    SMALLINT    CHECK (parameters >= 1 AND parameters <= 5), ' +
  'presentation  SMALLINT    CHECK (presentation >= 1 AND presentation <= 5), ' +
  'stepsClear    SMALLINT    CHECK (stepsClear >= 1 AND stepsClear <= 5), ' +
  'comment       VARCHAR(1000));', (err, res) => {
  if (err) {
    console.log("ERROR: Failed to create a table UTTask4. " + err.message)
  } else {
    console.log('Table UTTask4 created or already in database.');
  }
});


const port = process.env.PORT || 3000;
app.set('port', port);

const server = http.createServer(app);
server.listen(port, () => console.log('Running'));

app.post('/api/feedback', (req, res) => {
  const feedback = req.body;
  console.log('Feedback submitted: ', feedback);

  const rating = feedback.rating;
  const comment = feedback.comment;

  if (rating == null && comment == null) {
    console.log('ERROR: ' + 'All fields are empty');
    res.status(500).send({'error': 'All fields are empty'});
  }

  const query = 'INSERT INTO Feedback(rating, comment) VALUES($1, $2) RETURNING *';
  const values = [rating, comment];

  pool.query(query, values, (err, result) => {
    if (err) {
      handleError(res, err.message, 'Failed to send a feedback.');
    } else {
      console.log('Added new feedback: ', result.rows[0]);
      res.status(200).send(feedback);
    }
  });

});

app.post('/api/user-testing', (req, res) => {
  const utForm = req.body;
  console.log('User Testing form submitted: ', feedback);

  const personal = utForm.personal;
  const general = utForm.general;
  const task0 = utForm.task0;
  const task1 = utForm.task1;
  const task2 = utForm.task2;
  const task3 = utForm.task4;
  const task4 = utForm.task4;

  let responseID;

  if (personal == null && general == null && task0 == null && task1 == null &&
      task2 == null && task3 == null && task4 == null) {
    console.log('ERROR: ' + 'All fields are empty');
    res.status(500).send({'error': 'All fields are empty'});
  }

  const query = 'INSERT INTO UTPersonal(submissionTime, isStudent, tookCourse, kmapHear, kmapUse) VALUES(timestamp, $1, $2, $3, $4) RETURNING id';
  const values = [personal.isStudent, personal.tookCourse, personal.kmapHear, personal.kmapUse];

  pool.query(query, values, (err, result) => {
    if (err) {
      handleError(res, err.message, 'Failed to submit a user testing form for Personal.');
    } else {
      console.log('Added new User Testing Personal response with an id: ', result.rows[0]);
      responseID = result.rows[0];
      // res.status(200).send(feedback);

      const queryGeneral = 'INSERT INTO UTGeneral(id, navigation, beneficial, rating, comment) VALUES($1, $2, $3, $4, $5)';
      const valuesGeneral = [responseID, general.navigation, general.beneficial, general.rating, general.comment];

      pool.query(queryGeneral, valuesGeneral, (err, result) => {
        if (err) {
          handleError(res, err.message, 'Failed to submit a user testing response for General.');
        } else {
          console.log('Added new User Testing General response with an id: ', result.rows[0]);
          responseID = result.rows[0];
          res.status(200).send(utForm);
        }
      });

    }
  });

});
