import { ref, computed, toRef } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('useCounterStore', () => {
  const count = ref(0)
  let default_list = ref(
    {
      Monday: [{ task: 'This is a test of the new task layout for numerous words.', id: 1, isChecked: false },],
      Tuesday: [{ task: 'New Task', id: 3, isChecked: false },],
      Wednesday: [{ task: 'New Task', id: 5, isChecked: false },],
      Thursday: [{ task: 'New Task', id: 9, isChecked: false },],
      Friday: [{ task: 'New Task', id: 13, isChecked: false },],
      Saturday: [{ task: 'New Task', id: 17, isChecked: false },],
      Sunday: [{ task: 'New Task', id: 21, isChecked: false },]
    }
  )

  let default_goals_list = ref([
    { task: 'New Goal', id: 1000 },
  ]
  );

  const storedData = localStorage.getItem("useCounterStore");
  let initialWeekList = storedData ? JSON.parse(storedData).weekList : {};
  let initialGoalsList = storedData ? JSON.parse(storedData).goalsList : [];

  let weekList = !Object.values(initialWeekList).length ? initialWeekList = default_list.value : ref(initialWeekList).value;
  let goalsList = !initialGoalsList.length ? initialGoalsList = default_goals_list : ref(initialGoalsList);

  let maxId = Math.max(...Object.values(weekList).flat().map(task => task.id));
  let maxId_g = Math.max(...goalsList.value.map(e => e.id));


  const addTask = (val, day, target) => {
    let new_id;
    switch (target) {
      case "tasks":
        maxId < 1 ? maxId = 1 : maxId+= 1 ;
        console.log(maxId);
        new_id = maxId;
        weekList[day].push({
          task: val,
          id: new_id,
          isChecked: false,
        })
        break
      case "goals":
        maxId_g += 1
        new_id = maxId_g;
        goalsList.value.push({
          task: val,
          id: new_id,
        })
        break
    }
  }

  const delTask = (obj) => {
    let id = obj.id;
    let week = obj.week;
    let target = obj.target;
    let del_idx;

    switch (target) {
      case "tasks":
        del_idx = weekList[week].findIndex(e => e.id == id);
        weekList[week].splice(del_idx, 1);
        break
      case "goals":
        del_idx = goalsList.value.findIndex(e => e.id == id);
        goalsList.value.splice(del_idx, 1);
        break
    }

  }

  const copyTask = (obj) => {
    let id = obj.id;
    let week = obj.week;
    let target = obj.target;

    let new_id = maxId;
    let copy_obj = {};
    switch (target) {
      case "tasks":
        let copy_idx = weekList[week].findIndex(e => e.id == id);
        maxId += 1;
        new_id = maxId;
        copy_obj = {
          task: weekList[week][copy_idx].task,
          id: new_id,
          isChecked: false,
        }

        weekList[week].splice(copy_idx + 1, 0, copy_obj)
        break
      case "goals":
        maxId_g += 1;
        new_id = maxId_g;
        let copy_idx_g = goalsList.value.findIndex(e => e.id == id);
        console.log(goalsList.value);
        copy_obj = {
          task: goalsList.value[copy_idx_g].task,
          id: new_id,
        }

        goalsList.value.splice(copy_idx_g + 1, 0, copy_obj)
        break
    }


  }

  return { count, addTask, delTask, copyTask, weekList, goalsList }

},
  {
    persist: true,
  }
)
