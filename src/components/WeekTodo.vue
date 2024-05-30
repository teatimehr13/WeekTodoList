<script setup>
import { ref, defineComponent, nextTick } from 'vue'

import draggable from 'vuedraggable'

defineComponent({
    components: [
        { 'draggable': draggable },
    ]
});

const weekTasks = ref({
    Monday: [{ task: 'Task 1', id: 1, isChecked:false }, { task: 'Task 2', id: 2, isChecked:false }],
    Tuesday: [{ task: 'Task 3', id: 3, isChecked:false }, { task: 'Task 40', id: 4, isChecked:false }],
    Wednesday: [{ task: 'Task 4', id: 5, isChecked:false }, { task: 'Task 6', id: 7, isChecked:false }],
    Thursday: [{ task: 'Task 8', id: 9, isChecked:false }, { task: 'Task 10', id: 11, isChecked:false }],
    Friday: [{ task: 'Task 12', id: 13, isChecked:false }, { task: 'Task 14', id: 15, isChecked:false }],
    Saturday: [{ task: 'Task 16', id: 17, isChecked:false }, { task: 'Task 18', id: 19, isChecked:false }],
    Sunday: [{ task: 'Task 20', id: 21, isChecked:false }, { task: 'Task 22', id: 23, isChecked:false }]
});

let isEdit = ref(null);

const onMove = () => {
    console.log(weekTasks.value);
};

const toggleClick = (data) => {
    data.isChecked = !data.isChecked;
}

const swEditInput = (id) => {
    isEdit.value === id ? isEdit.value = null : isEdit.value = id;

    nextTick(() => {
    if (inputRefs.value[id]) {
      console.log(inputRefs.value[id]);
      inputRefs.value[id].focus();
    }
  });
}

//使用id做為key or 使用兩層index作為target
let inputRefs = ref([]); 


</script>

<template>
    <div class="week-container">
        <div v-for="(tasks, day) in weekTasks" :key="day" class="day-container">
            <div>
                <h4>{{ day }}</h4>
            </div>
            <ul>
                <draggable :list="tasks" group="tasks" @start="drag = true" @end="drag = false" item-key="id"
                    :move="onMove">
                    <template #item="{ element, index }">
                        <li>
                            <div v-show="isEdit != element.id">
                                <input type="checkbox" v-model="element.isChecked">
                                <span @click="toggleClick(element)" @dblclick="swEditInput(element.id)">{{ element.task }}</span>
                            </div>
                            <div v-show="isEdit == element.id">
                                <input type="text" v-model="element.task" @blur="swEditInput" @keyup.enter="$event.target.blur()"
                                :ref="el => inputRefs[element.id] = el">
                            </div>
                        </li>
                    </template>
                </draggable>
            </ul>
        </div>
    </div>
</template>

<style scoped>
.week-container {
    display: flex;
    justify-content: center;
    width: 1000px;
    margin: auto;
}

.day-container {
    background-color: #eee;
    color: #55595C;
}

.day-container+.day-container {
    margin: 0 10px;
}

input:focus {
    outline: none;
}

input{
    outline: none;
    border: none;
}

</style>