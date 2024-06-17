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
let isHover = ref(null);
let swAdd_area = ref(true);
let swNew_input = ref(null);
let new_input = ref([]);

let active = false;
let popActive = ref(false);
let tooltipActive = ref(false);
let isDrag = ref(false);


const onMove = () => {
    isDrag.value = true;
};

const toggleClick = (data) => {
    data.isChecked = !data.isChecked;
}
const swEditInput = (id) => {
    // console.log(isEdit.value);
    isEdit.value === id ? isEdit.value = null : isEdit.value = id;
    isHover.value = null;
    nextTick(() => {
        if (inputRefs.value[id]) {
            inputRefs.value[id].focus();
        }
    });
}

let isFocused = false;
const swHoverContent = (id) => {
    inputRefs.value[id].addEventListener('focus', () => {
        isFocused = true;
    });

    inputRefs.value[id].addEventListener('blur', () => {
        isFocused = false;
        isHover.value = null;
    });

    if (!isFocused && !isDrag.value) {
        isHover.value === id ? isHover.value = null : isHover.value = id;
    }

    isDrag.value = false;
}

const handleClick = (id) => {
    swHoverContent(id)
}

const newInput_Toggle = (day) => {
    swNew_input.value == day ? swNew_input.value = null : swNew_input.value = day;
    active = true;
    nextTick(() => {
        if (new_input.value[day]) {
            new_input.value[day].focus()
        }
    })
}

const add_task = (day) => {
    let val = event.target.value.trim();
    emits("addTask", val, day)
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

const updateContent = (target) => {
    target.task = event.target.innerText;
};

const sw_pop = () => {
    popActive.value = !popActive.value;
    tooltipActive.value = false;
}

const sw_tool = (status) => {
    switch(status){
        case "close":
            tooltipActive.value = false;
        break
        default:
        tooltipActive.value = !tooltipActive.value;
    }
}

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
                        item-key="id" :move="onMove" class="drag-container" tag="ul" ghost-class="ghost"
                        drag-class="drag" handle=".handle">
                        <template #item="{ element, index }">
                            <li class="list-container">
                                <div class="list-content">
                                    <div v-show="isEdit != element.id" @mouseenter="swHoverContent(element.id)"
                                        @click="handleClick(element.id)">
                                        <input type="checkbox" v-model="element.isChecked">
                                        <span>{{ element.task }}</span>
                                    </div>
                                    <!-- <div v-show="isEdit == element.id">
                                        <input type="text" v-model="element.task" @blur="swEditInput"
                                            @keyup.enter="$event.target.blur()" :ref="el => inputRefs[element.id] = el">
                                    </div> -->
                                </div>
                                <div class="list-hover-content" v-show="isHover == element.id"
                                    @mouseleave="swHoverContent(element.id)">
                                    <div class="list-hover-container">
                                        <div>
                                            <input type="checkbox" v-model="element.isChecked">
                                            <div contenteditable="true" data-content-editable-leaf="true"
                                                @input="updateContent(element)" :ref="el => inputRefs[element.id] = el">
                                                {{ element.task }}</div>
                                        </div>
                                        <div class="list-icon-group" @click="sw_pop" @mouseenter="sw_tool" @mousedown="sw_tool('close')">
                                            <span class="handle" >
                                                <font-awesome-icon :icon="['fas', 'grip-vertical']" />
                                            </span>
                                            <div class="tooltip" v-show="tooltipActive" >
                                                <p>Drag to move</p>
                                                <p>Click to open menu</p>
                                            </div>

                                            <div class="popover" v-if="popActive">
                                                <div class="delete">Delete</div>
                                                <div class="copy">Copy</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </template>
                        <template #footer>
                            <div style="flex-grow: 1;" class="here draggable-item" v-show="swAdd_area">
                                <div class="new-todo-area">
                                    <input v-if="swNew_input == day" type="text" class="new-todo-input"
                                        placeholder="請輸入新任務" style="width: max-content;"
                                        :ref="el => new_input[day] = el" @blur="add_task(day)"
                                        @keyup.enter="$event.target.blur()">
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
.handle {
    /* position: absolute;
  left: -20px; */
}

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

.list-container {
    position: relative;
}

.list-content>div,
.list-hover-content>div {
    display: flex;
}


.list-content span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.list-content>div:first-child {
    padding: 0px 5px;
}

.new-todo-area+.new-todo-area {
    /* border-top: 1px solid #eaecef; */
}

.new-todo-area button {
    color: #bbb;
    font-size: .75rem;
    text-align: left;
    min-height: 24px;
    border: none;
    background: none;
    padding: 0 5px;
}

.list-hover-content {
    word-break: break-word;
    box-shadow: 0 2px 13px 0 rgba(0, 0, 0, .15);
    border-radius: 5px;
    position: absolute;
    z-index: 9;
    top: 0;
    left: 0;
    padding: 0px 5px;
    width: 99%;
    background-color: #fff;
}

.list-hover-container {
    display: flex;
    justify-content: space-between;
}

.list-hover-container input[type="checkbox"] {
    align-self: start;
    min-height: 1.2rem;
}

.list-hover-container>div {
    display: flex;
}

.list-hover-content span {
    word-break: break-word;
    word-wrap: break-word;
}

.list-icon-group {
    height: max-content;
    position: relative;
    cursor: pointer;
}

.list-icon-group .tooltip {
    position: absolute;
    background-color: rgba(0, 0, 0, .7);
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px;
    z-index: 1;
    bottom: -50%;
    margin-bottom: -50px;
    margin-left: -73px;
    /* opacity:1;
    visibility: visible; */
    transition: opacity 0.3s;
    width: max-content;
}

.list-icon-group .tooltip::after {
    content: "";
    position: absolute;
    bottom: 0;
    margin-bottom: 60px;
    left: 50%;
    margin-left: 5px;
    border-width: 5px;
    border-style: solid;
    border-color: transparent transparent black transparent;

}



.list-icon-group .popover {
    visibility: visible;
    width: max-content;
    background-color: #FFF;
    color: #55595c;
    text-align: center;
    border-radius: 6px;
    padding: 5px;
    position: absolute;
    z-index: 1;
    bottom: -5px;
    right: 12px;
    transform: translate(100%, 100%);
    opacity: 1;
    transition: opacity 0.3s;
    box-shadow: 0 1px 15px 2px rgba(0,0,0,.15);
}

.popover div {
    padding: 5px;
    border-radius: 5px;
}

.popover .delete {
    color: rgb(209, 60, 60);
}

.popover div:hover {
    background-color: #eee;
}

.list-icon-group>span {
    margin: 0 5px;
    color: #8b8b8b;
}

.list-icon-group>span:hover {
    color: #55595c;

}

.new-todo-area button:hover {
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

.ghost>div {
    visibility: hidden;
}

[contenteditable="true"] {
    outline: none;
    width: 100%;
    min-width: 150px;
}

</style>