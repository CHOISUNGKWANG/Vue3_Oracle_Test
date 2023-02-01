<template>
  <div class="memo">
    <div class="act">
      <button class="btn btn-primary w-100" @click="add()">+ 추가</button>
    </div>
    <ul>
      <li v-for="(d, idx) in state.data" :key="d" @click="edit(d, idx)">{{ d[2] }}</li>
    </ul>
  </div>
</template>

<script>
import { reactive } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const state = reactive({
      data: [],
    });

    const add = async () => {
      const content = prompt('내용을 입력해주세요.');

      if (!content) {
        return alert('내용을 입력해주세요.');
        add();
      }

      // Insert
      await axios
        .post('/api/memos', { content })
        .then((res) => {})
        .catch((err) => {
          console.log(err.response);
        });

      // 조회
      await axios
        .get('/api/memos')
        .then((res) => {
          state.data = res.data;
        })
        .catch((err) => {
          console.log(err.response);
        });
    };

    const edit = async (d, idx) => {
      const content = prompt('내용을 입력해주세요.', state.data[idx][2]);

      // Update
      await axios.put('/api/memos', { d, content }).then((res) => {});

      // 조회
      await axios
        .get('/api/memos')
        .then((res) => {
          state.data = res.data;
        })
        .catch((err) => {
          console.log(err.response);
        });
    };

    axios
      .get('/api/memos')
      .then((res) => {
        state.data = res.data;
      })
      .catch((err) => {
        console.log(err.response);
      });

    return { state, add, edit };
  },
};
</script>

<style lang="scss" scoped>
.memo {
  .act {
    padding: 5px;
    text-align: right;
  }

  ul {
    border-top: 1px solid #eee;
    list-style: none;
    padding: 15px;
    margin: 0;

    li {
      padding: 15px;
      margin: 10px 0;
      border: 1px solid #eee;
    }
  }
}
</style>
