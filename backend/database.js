const oracledb = require('oracledb');
const connectionInfo = require('./connection-info');

oracledb.initOracleClient({ libDir: 'C:\\instantclient_21_8' });

module.exports = {
  async run(query) {
    return new Promise((resolve) => {
      oracledb.getConnection(
        {
          user: connectionInfo.oracle.user,
          password: connectionInfo.oracle.password,
          connectString: connectionInfo.oracle.connectString,
        },
        function (err, conn) {
          if (err) {
            throw err;
          }

          console.log('Oracle DB 연결 성공!!');

          conn.execute(query, [], function (err, result) {
            if (err) {
              throw err;
            }

            console.log('실행결과:');
            console.log(result);

            // 칼럼명 삽입
            result.rows.unshift(result.metaData);

            resolve(result.rows);

            // 커넥션 종료 전에 커밋(IUD용)
            conn.commit();

            // DB 종료
            doRelease(conn);
          });
        }
      );

      //DB 종료
      function doRelease(conn) {
        conn.release(function (err) {
          if (err) {
            throw err;
          }

          console.log('DB 종료!!');
        });
      }
    });
  },
};
