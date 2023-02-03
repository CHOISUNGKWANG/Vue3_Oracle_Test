<template>
	<div id="app-container">
		<DxDataGrid
			:data-source="state.data"
			:key-expr="['ORDKEY', 'PATNUM']"
			:show-borders="true"
			:focused-row-enabled="true"
			@saving="onSaving"
		>
			<DxEditing
				:allow-updating="true"
				:allow-adding="true"
				:allow-deleting="true"
				mode="batch"
			/>
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
	</div>
</template>

<script>
import 'devextreme/dist/css/dx.light.css';
import {
	DxDataGrid,
	DxColumn,
	DxEditing,
	DxPaging,
} from 'devextreme-vue/data-grid';

import {reactive} from 'vue';
import axios from 'axios';

export default {
	components: {
		DxDataGrid,
		DxColumn,
		DxEditing,
		DxPaging,
	},
	setup() {
		const state = reactive({
			data: [],
		});

		// 값만 나열되어 있는 배열을 key-value형태의 객체로 변환 작업
		//res.data 나열 (0번째는 칼럼명, 1번째 인덱스부터 끝까지 값)
		const fnKeyValueFormat = (res) => {
			// 가공된 객체들(행 데이터)을 담을 배열
			let lKeyValueData = [];

			// key(칼럼명)가 들어간 기본틀
			const ldefaultFormat = {};

			// 객체에 key(칼럼명) 추가
			// ex) {HOSPID: '', USERID: '', USERNM: ''}
			for (let i = 0; i < res.data[0].length; i++) {
				ldefaultFormat[res.data[0][i].name] = '';
			}

			// 객체에 값을 넣는 작업 (1번째 인덱스부터 값임)
			for (let i = 1; i < res.data.length; i++) {
				// 행 데이터를 담을 객체 = 만들어둔 객체 기본틀 복제 (참조할당x)
				let lKeyValueDataRow = Object.assign({}, ldefaultFormat);

				// 첫번째 key(칼럼명)부터 순차적으로 값 삽입
				for (let j = 0; j < res.data[i].length; j++) {
					lKeyValueDataRow[Object.keys(lKeyValueDataRow)[j]] = res.data[i][j];
				}

				// 값을 넣은 객체를 배열에 push
				lKeyValueData.push(lKeyValueDataRow);
			}

			// 가공된 데이터 확인
			console.log(lKeyValueData);

			return lKeyValueData;
		};

		// 조회 요청
		axios
			.get('/api/memos')
			.then((res) => {
				// const dataSource = new DataSource({
				// 	store: new ArrayStore({
				// 		data: fnKeyValueFormat(res),
				// 		key: ['ORDKEY', 'PATNUM'],
				// 	}),
				// });
				// state.data = dataSource;

				state.data = fnKeyValueFormat(res);
			})
			.catch((err) => {
				console.log(err.response);
			});

		return {state};
	},
	methods: {
		onSaving(e) {
			e.cancel = true;
			console.log(e.changes);

			axios
				.post('/api/IUD', e.changes)
				.then((res) => {
					console.log(res);
				})
				.catch((err) => {
					console.log(err.response);
				});
		},
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
