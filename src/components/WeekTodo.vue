<script setup>
import { ref, defineComponent, nextTick } from 'vue'

import draggable from 'vuedraggable'

defineComponent({
    components: [
        { 'draggable': draggable },
    ]
});

const props = defineProps(
    ["weekTasks"]
);

const emits = defineEmits(["addTask"]);

let weekTasks = props.weekTasks;
console.log(weekTasks);

let isEdit = ref(null);
let swAdd_area = ref(true);
let swNew_input = ref(null);
let new_input = ref([]);

let active = false;


const onMove = () => {
    console.log(weekTasks.value);
};

const toggleClick = (data) => {
    data.isChecked = !data.isChecked;
}
const swEditInput = (id) => {
    // console.log(isEdit.value);
    isEdit.value === id ? isEdit.value = null : isEdit.value = id;
    nextTick(() => {
        if (inputRefs.value[id]) {
            inputRefs.value[id].focus();
        }
    });
}

const newInput_Toggle = (day) => {
    swNew_input.value == day ? swNew_input.value = null : swNew_input.value = day;
    active = true;
    nextTick(() => {
        if(new_input.value[day]) {
            new_input.value[day].focus()
        }
    })
}

const add_task = (day) => {
    let val = event.target.value.trim();
    emits("addTask",val,day)
    swNew_input.value = null
}

// const handleDrop = (event) => {
//       console.log('Item dropped in external zone');
//       nextTick(() => {
//           swAdd_input.value = !swAdd_input.value;
//       })
//       // Handle the drop logic
//     };
// const overDrop = (event) => {
//     swAdd_input.value = !swAdd_input.value;
// }

const onDragStart = (event) => {
    swAdd_area.value = !swAdd_area.value;
};

const onDragEnd = (event) => {
    swAdd_area.value = !swAdd_area.value;
};


//使用id做為key or 使用兩層index作為target
let inputRefs = ref([]);
</script>

<template>
    <div class="week-container">
        <div v-for="(tasks, day) in weekTasks" :key="day" class="day-container">
            <div>
                <div>
                    <h4>{{ day }}</h4>
                </div>
                <ul>
                    <draggable :list="tasks" group="tasks" animation="300" @start="onDragStart" @end="onDragEnd"
                        item-key="id" :move="onMove" class="drag-container" tag="ul" ghost-class="ghost" drag-class="drag">
                        <template #item="{ element, index }">
                            <li>
                                <div v-show="isEdit != element.id" @dblclick="swEditInput(element.id)">
                                    <input type="checkbox" v-model="element.isChecked">
                                    <span @click="toggleClick(element)">{{ element.task }}</span>
                                </div>
                                <div v-show="isEdit == element.id">
                                    <input type="text" v-model="element.task" @blur="swEditInput"
                                        @keyup.enter="$event.target.blur()" :ref="el => inputRefs[element.id] = el">
                                </div>
                            </li>
                        </template>
                        <template #footer>
                            <div style="flex-grow: 1;" class="here draggable-item" v-show="swAdd_area">
                                <div class="new-todo-area">
                                    <input v-if="swNew_input == day" type="text" class="new-todo-input" placeholder="請輸入新任務"
                                        style="width: max-content;" :ref="el => new_input[day] = el" @blur="add_task(day)" @keyup.enter="$event.target.blur()" >
                                    <button @click="newInput_Toggle(day)" v-show="swNew_input != day">
                                        <font-awesome-icon :icon="['fas', 'plus']" />
                                        <span> New</span>
                                    </button>
                                </div>
                            </div>
                        </template>
                    </draggable>
                </ul>
            </div>
        </div>
    </div>
</template>

<style scoped>
.week-container {
    display: flex;
    justify-content: center;
    width: 100%;
    margin: auto;
    flex-grow: 1;
    overflow-x: hidden;
    min-height: 250px;
}

.day-container {
    color: #55595C;
    flex: 0 0 20%;
    padding: 10px 20px;
    box-sizing: border-box;
    max-width: 20%;
}

.day-container>div {
    background: white;
    display: flex;
    flex-direction: column;
    height: 100%;
}

input:focus {
    outline: none;
}

input[type="text"] {
    outline: none;
    border: none;
    background: transparent;
}

li {
    /* border-bottom: 1px solid #eaecef; */
}

li>div {
    display: flex;
}

li span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

li>div:first-child {
    padding: 0px 5px;
}

.new-todo-area+.new-todo-area {
    /* border-top: 1px solid #eaecef; */
}

.new-todo-area button{
    color: #bbb;
    font-size: .75rem;
    text-align: left;
    min-height: 24px;
    border: none;
    background: none;
    padding: 0 5px;
}

.new-todo-area button:hover{
    cursor: pointer;
    background-color: whitesmoke;
    color: #aaa;
}

.new-todo-area {
    display: grid;
}


.fake-area {
    background-image: linear-gradient(0deg, transparent 48.08%, #eaecef 0, #eaecef 50%, transparent 0, transparent 98.08%, #eaecef 0, #eaecef);
    background-size: 52px 52px;
    height: calc(100% - 25px);
}

.drag-container {
    min-height: 250px;
}

.drag-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.ghost {
  background: whitesmoke;
}

.ghost > div {
  visibility: hidden;
}

.drag > div {
}

.hide {
    display: none;
}
</style>