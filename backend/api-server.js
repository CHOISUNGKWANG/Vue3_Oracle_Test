const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const database = require('./database');
const mybatisMapper = require('mybatis-mapper');

app.use(bodyParser.json());

mybatisMapper.createMapper(['./oracle-mapper.xml']);

// 조회 test
app.get('/api/memos', async (req, res) => {
  let param = {
    PATNUM: '000050003',
  };
  let format = { language: 'sql', indent: '  ' };
  let query = mybatisMapper.getStatement('ORB', 'selectORB1010', param, format);

  const result = await database.run(query);
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
