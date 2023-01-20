const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const database = require('./database');

const memos = [];

app.use(bodyParser.json());

// 조회 test
app.get('/api/memos', async (req, res) => {
  const result = await database.run('SELECT HOSPID, USERID, USERNM FROM ADI0100', []);
  res.send(result);
});

// Insert
app.post('/api/memos', async (req, res) => {
  console.log('입력한 값:');
  console.log(req.body.content);
  await database.run('INSERT INTO ADI0100 (HOSPID, USERID, USERNM, PASSWD) VALUES (:HOSPID, :USERID, :USERNM, :PASSWD)', [
    '00001',
    'TEST',
    `${req.body.content}`,
    '1111',
  ]);
  res.send();
});

// Update
app.put('/api/memos', async (req, res) => {
  let lParams = req.body.d;
  let lHOSPID = lParams[0];
  let lUSERID = lParams[1];
  let lUSERNM = req.body.content;
  await database.run('UPDATE ADI0100 SET USERNM = :USERNM WHERE HOSPID = :HOSPID AND USERID = :USERID', [lUSERNM, lHOSPID, lUSERID]);
  res.send();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
