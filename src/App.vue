<script setup>
import WeekTodo from '@/components/WeekTodo.vue';
import { useCounterStore } from '@/stores/counter';
import { storeToRefs } from 'pinia';

const store = useCounterStore();
const storeData = storeToRefs(useCounterStore());
let week_tasks = storeData.weekList.value;
let goals_tasks = storeData.goalsList.value;


const emitAddTask = (val,day,target) => {
  store.addTask(val,day,target)
}

const emitDelTask = (copy_del_obj) => {
  store.delTask(copy_del_obj)
}

const emitCopyTask = (copy_del_obj) => {
  store.copyTask(copy_del_obj)
}

const emitChangePri = (copy_del_obj, priority) => {
  store.changePri(copy_del_obj, priority)
}

</script>

<template>
  <main>
    <WeekTodo :weekTasks="week_tasks" :goalsTask="goals_tasks"
    @addTask="emitAddTask" @delTask="emitDelTask" @copyTask="emitCopyTask" @changePri="emitChangePri"
    ></WeekTodo>
  </main>
</template>

<style>
  *{
    padding: 0;
    margin: 0;
    list-style: none;
  }

  body {
    /* background-color: #f1f6fb; */
  }

  #app {
    display: block;
    width: 100%;
    padding: 0;
    /* background: #f8f8ff; */
    max-width: 100%;
  }
</style>
