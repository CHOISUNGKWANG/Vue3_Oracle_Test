<template>
  <div id="app-container">
    <DxDataGrid :data-source="state.data" key-expr="ORDKEY" :show-borders="true" :focused-row-enabled="true">
      <DxEditing :allow-updating="true" :allow-adding="true" :allow-deleting="true" mode="batch" />
      <DxPaging :enabled="false" />
      <DxColumn data-field="PATNUM" width="100px" />
      <DxColumn data-field="ORDKEY" width="350px" />
      <DxColumn data-field="ODCODE" />
      <DxColumn data-field="ARESDT" />
      <DxColumn data-field="REGDAT" />
      <DxColumn data-field="RESDAT" />
      <DxColumn data-field="ACTDAT" />
      <DxColumn data-field="RSTDAT" />
    </DxDataGrid>
    <!-- <DxCalendar> </DxCalendar> -->
  </div>
</template>

<script>
import 'devextreme/dist/css/dx.light.css';
import { DxDataGrid, DxColumn, DxEditing, DxPaging } from 'devextreme-vue/data-grid';
// import { DxCalendar } from 'devextreme-vue/calendar';

import { reactive } from 'vue';
import axios from 'axios';

export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxPaging,
    // DxCalendar,
  },
  setup() {
    const state = reactive({
      data: [],
    });

    const fnKeyValueFormat = (res) => {
      // 값만 나열되어 있는 배열을 key-value형태의 객체로 변환 작업
      //res.data 나열(1번째 인덱스부터 끝까지 값, 0번째는 칼럼명)

      let lKeyValueData = [];

      // 객체에 값을 넣는 작업 (1번째 인덱스부터 값임)
      for (let i = 1; i < res.data.length; i++) {
        // 객체에 칼럼명 key 추가
        // ex) {HOSPID: '', USERID: '', USERNM: ''}
        let lKeyValueDataRow = {};
        for (let k = 0; k < res.data[0].length; k++) {
          lKeyValueDataRow[res.data[0][k].name] = '';
        }

        // 첫번째 key부터 순차적으로 값 삽입
        for (let j = 0; j < res.data[i].length; j++) {
          lKeyValueDataRow[Object.keys(lKeyValueDataRow)[j]] = res.data[i][j];
        }

        // 값을 넣은 객체를 배열에 push
        lKeyValueData.push(lKeyValueDataRow);
      }

      console.log(lKeyValueData);
      return lKeyValueData;
    };

    // 조회 요청
    axios
      .get('/api/memos')
      .then((res) => {
        state.data = fnKeyValueFormat(res);
      })
      .catch((err) => {
        console.log(err.response);
      });

    return { state };
  },
};
</script>

<style>
#dataGrid {
  height: 500px;
}

.dx-datagrid .dx-row-lines > td,
.dx-datagrid-headers .dx-datagrid-table .dx-row > td {
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
}
</style>
