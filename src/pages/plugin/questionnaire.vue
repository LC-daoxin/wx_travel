<template>
  <view>
    <liu-slide-questions :questionsAnswer="questionsAnswer" @submit="subData" />
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
const questionsAnswer = reactive<any>([
  {
    title: '这是一道单选题',
    problemType: 'SINGLE',
    children: [{
      ifselect: 0,
      alias: 'A',
      answer: '选项1'
    }, {
      ifselect: 0,
      alias: 'B',
      answer: '选项2'
    }, {
      ifselect: 0,
      alias: 'C',
      answer: '选项3'
    }],
  },
  {
    title: '这是一道多选题',
    problemType: 'MULTY',
    children: [{
      ifselect: 0,
      alias: 'A',
      answer: '选项1'
    }, {
      ifselect: 0,
      alias: 'B',
      answer: '选项2'
    }, {
      ifselect: 0,
      alias: 'C',
      answer: '选项3'
    }, {
      ifselect: 0,
      alias: 'D',
      answer: '选项4'
    }],
  },
  {
    title: '这是一道简答题',
    problemType: 'QUESTION',
    answer: ''
  }
])
const subData = (data) => {
  console.log('提交的数据', JSON.parse(JSON.stringify(data)))
}
</script>

<style lang="scss"></style>
