<script setup>
import WeekTodo from '@/components/WeekTodo.vue';
import { useCounterStore } from '@/stores/counter';
import { storeToRefs } from 'pinia';

const store = useCounterStore();
const storeData = storeToRefs(useCounterStore());
let week_tasks = storeData.weekList.value;
console.log(week_tasks);

const emitAddTask = (val,day) => {
  store.addTask(val,day)
}
</script>

<template>
  <main>
    <WeekTodo :weekTasks="week_tasks" @addTask="emitAddTask"></WeekTodo>
  </main>
</template>

<style>
  *{
    padding: 0;
    margin: 0;
    list-style: none;
  }

  #app {
    display: block;
    width: 100%;
    padding: 0;
    background: #f8f8ff;
  }
</style>
