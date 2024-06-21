<script setup>
import { ref, defineComponent, nextTick, onMounted, onUnmounted, reactive, computed } from 'vue'

import draggable from 'vuedraggable'

defineComponent({
    components: [
        { 'draggable': draggable },
    ]
});

const props = defineProps(
    ["weekTasks"]
);

const emits = defineEmits(["addTask", "delTask", "copyTask"]);

let weekTasks = props.weekTasks;
console.log(weekTasks);

let isEdit = ref(null);
let isHover = ref(null);
let swAdd_area = ref(true);
let swNew_input = ref(null);
let new_input = ref([]);

let active = false;
let popActive = ref(false);
let popup = ref(null);
let tooltipActive = ref(false);
let isDrag = ref(false);
let disableDraggable = ref(false);
let contenteditable = ref(true);
let weeksArr = ref([]);
let todayTime = ref(null);
let currentDate = ref(null);

let popUp = reactive({
    top: '0px',
    left: '0px'
})

let copy_del_obj = reactive({
    week: null,
    id: null
});

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
    });

    if (!isFocused && !isDrag.value && !popActive.value) {
        isHover.value === id ? isHover.value = null : isHover.value = id;
    }

    isDrag.value = false;
    tooltipActive.value = false;
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

const del_task = () => {
    emits("delTask", copy_del_obj);
    popActive.value = !popActive.value;
}

const copy_task = () => {
    emits("copyTask", copy_del_obj);
    popActive.value = !popActive.value;
}

const onDragStart = (event) => {
    swAdd_area.value = !swAdd_area.value;
};

const onDragEnd = (event) => {
    swAdd_area.value = !swAdd_area.value;
};

const updateContent = (target) => {
    target.task = event.target.innerText;
};

const sw_pop = (id, week) => {
    copy_del_obj.id = id;
    copy_del_obj.week = week;

    const buttonRect = event.target.getBoundingClientRect();
    popUp.top = `${buttonRect.bottom + window.scrollY + 3}px`;
    popUp.left = `${buttonRect.left + window.scrollX}px`;

    popActive.value = !popActive.value;
    tooltipActive.value = false;
    disableDraggable.value = !disableDraggable.value;
    contenteditable.value = !contenteditable.value;
}

const sw_tool = (status) => {
    switch (status) {
        case "close":
            tooltipActive.value = false;
            break
        default:
            if (popActive.value) {
                tooltipActive.value = false;
            } else {
                const buttonRect = event.target.getBoundingClientRect();
                popUp.top = `${buttonRect.bottom + window.scrollY + 3}px`;
                popUp.left = `${buttonRect.left + window.scrollX}px`;
                tooltipActive.value = true;
            }
    }
}

let removeYourListener = null;
const handleClickOutside = (event) => {
    let els = document.querySelectorAll(".list-icon-group");
    let hover_content = document.querySelectorAll(".list-hover-content");
    const YOUR_ELEMENT = popup.value;

    //nodelist to array
    //return true if any one of the conditions is met
    const isClickInside = Array.from(els).some((el) => {
        return el.contains(event.target);
    });

    const isClickInside2 = Array.from(hover_content).some((el) => {
        return el.contains(event.target);
    });

    if (!YOUR_ELEMENT.contains(event.target) && !isClickInside && !isClickInside2) {
        popActive.value = false;
        isHover.value = null
        contenteditable.value = true;
        disableDraggable.value = false;
    }
};

const getWeek = () => {
    const newDate = new Date();
    const weekDay = newDate.getDay();
    const daysOffset = weekDay === 0 ? -6 : 1 - weekDay; //今天距離本週一有幾天
    const monday = new Date(newDate);
    monday.setDate(newDate.getDate() + daysOffset); //拿到週一日期

    const weekDates = [];
    for (let i = 0; i < 7; i++) {
        let date = new Date();
        date.setDate(monday.getDate() + i)

        const formattedDate = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
        weekDates.push(formattedDate);
    }

    return weekDates
}


onMounted(() => {
    document.addEventListener("mousedown", handleClickOutside);
    weeksArr.value = getWeek();
    let date = new Date();
    currentDate.value = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
});

onUnmounted(() => {
    if (removeYourListener) {
        document.removeEventListener("mousedown", handleClickOutside);
    }
});

//使用id做為key or 使用兩層index作為target
let inputRefs = ref([]);
</script>

<template>
    <div class="layout layout-width">
        <div class="week-container">
            <div v-for="(tasks, day, idx) in weekTasks" :key="day" class="day-container">
                <div>
                    <div class="week-con">
                        <h2>{{ day }}</h2>
                        <span class="week-text" :class="{ current_date: currentDate == weeksArr[idx]}"> {{ weeksArr[idx] }}</span>
                        <span v-if="weeksArr[idx] === currentDate" :class="{ current_date: currentDate == weeksArr[idx]}"> (today)</span>
                    </div>
                    <ul>
                        <draggable :list="tasks" group="tasks" animation="300" @start="onDragStart" @end="onDragEnd"
                            item-key="id" :move="onMove" class="drag-container" tag="ul" ghost-class="ghost"
                            drag-class="drag" handle=".handle" :disabled="disableDraggable">
                            <template #item="{ element, index }">
                                <li class="list-container">
                                    <div class="list-content">
                                        <div v-show="isEdit != element.id" @mouseenter="swHoverContent(element.id)"
                                            @click="handleClick(element.id)">
                                            <input type="checkbox" v-model="element.isChecked">
                                            <span>{{ element.task }}</span>
                                        </div>
                                    </div>
                                    <div class="list-hover-content" v-show="isHover == element.id"
                                        @mouseleave="swHoverContent(element.id)">
                                        <div class="list-hover-container">
                                            <div>
                                                <input type="checkbox" v-model="element.isChecked">
                                                <div :contenteditable=contenteditable @input="updateContent(element)"
                                                    :ref="el => inputRefs[element.id] = el">
                                                    {{ element.task }}</div>
                                            </div>
                                            <div class="list-icon-group" @click="sw_pop(element.id, day)"
                                                @mouseenter="sw_tool" @mousedown="sw_tool('close')">
                                                <span class="handle">
                                                    <font-awesome-icon :icon="['fas', 'grip-vertical']" />
                                                </span>

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
                                            <!-- <font-awesome-icon :icon="['fas', 'plus']" /> -->
                                            <svg width="16" height="16" viewBox="0 0 24 24" xfill-rule="evenodd"
                                                clip-rule="evenodd">
                                                <path d="M11 11v-11h1v11h11v1h-11v11h-1v-11h-11v-1h11z"
                                                    class="plus-path" />
                                            </svg>
                                            <span> Add Task</span>
                                        </button>
                                    </div>
                                </div>
                            </template>
                        </draggable>
                    </ul>
                </div>
            </div>
        </div>

        <div class="tooltip" v-show="tooltipActive" :style="popUp">
            <p>Drag to move</p>
            <p>Click to open menu</p>
        </div>

        <div class="popover" v-show="popActive" ref="popup" :style="popUp">
            <div class="delete" @click="del_task">
                <font-awesome-icon :icon="['fas', 'trash-can']" />
                Delete
            </div>
            <div class="copy" @click="copy_task">
                <font-awesome-icon :icon="['fas', 'copy']" />
                Copy
            </div>
        </div>

    </div>
</template>

<style scoped>
span {
    font-size: 16px;
}

[contenteditable] {
    font-size: 16px;
}

h2 {
    color: #55595c;
}

.week-con {
    margin-bottom: 8px;
    background-color: rgb(241, 241, 239);
    position: relative;
    padding: 2px 5px;
    box-sizing: border-box;
}

.week-con::after {
    content: "";
    position: absolute;
    bottom: -5px ;
    left: 0;
    width: 100%;
    border-bottom: 1px solid rgba(44, 43, 38, 0.16);
}

.week-text {
    color: #808080;
    font-size: 14px;
}

.current_date {
    color:#4d90d3;
}

.layout-width {
    --margin-width: 96px;
    --content-width: 1fr;
}

.layout {
    display: grid;
    grid-template-columns:
        [full-start] var(--margin-width) [content-start] var(--content-width) [content-end] var(--margin-width) [full-end];
}

.week-container {
    display: flex;
    width: 100%;
    margin: auto;
    flex-grow: 1;
    flex-wrap: wrap;
    min-height: 250px;
    grid-column: content;
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

.new-todo-area button {
    /* color: #6f7579; */
    color: #aaa;
    font-size: .75rem;
    text-align: left;
    min-height: 24px;
    /* border: 1px solid rgba(55, 53, 47, 0.16); */
    border: none;
    border-radius: 4px;
    background: none;
    padding: 0 5px;
    height: 1.5rem;

}

.new-todo-area button:hover {
    cursor: pointer;
    background-color: whitesmoke;
    color: #6f7579;
}

.plus-path {
    fill: #aaa;
}

.plus-path:hover {
    fill: #6f7579;
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
    width: 100%;
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

.tooltip {
    position: absolute;
    background-color: rgba(0, 0, 0, .7);
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px;
    z-index: 9;
    transition: opacity 0.3s;
    width: max-content;
    transform: translate(-50%, 10px);
}

.tooltip::after {
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


.popover {
    visibility: visible;
    width: max-content;
    background-color: #FFF;
    color: #55595c;
    text-align: center;
    border-radius: 6px;
    padding: 5px;
    position: absolute;
    z-index: 9;
    opacity: 1;
    transition: opacity 0.3s;
    box-shadow: 0 1px 15px 2px rgba(0, 0, 0, .15);
}

.popover div {
    padding: 5px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    column-gap: 5px;
}

.popover .delete {
    color: rgb(209, 60, 60);
}

.popover div:hover {
    background-color: #eee;
    cursor: pointer;
}


.list-icon-group>span {
    margin: 0 5px;
    color: #8b8b8b;
}

.list-icon-group>span:hover {
    color: #55595c;

}


.new-todo-area {
    display: grid;
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
    min-width: 50px;
}
</style>