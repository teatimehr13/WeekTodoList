import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('useCounterStore', () => {
  const count = ref(0)
  let default_list = ref(
    {
      Monday: [{ task: 'Task 1', id: 1, isChecked: false }, { task: 'Task 2', id: 2, isChecked: false }],
      Tuesday: [{ task: 'Task 3454354565456546546546', id: 3, isChecked: false }, { task: 'Task 40', id: 4, isChecked: false }],
      Wednesday: [{ task: 'Task 4', id: 5, isChecked: false }, { task: 'Task 6', id: 7, isChecked: false }],
      Thursday: [{ task: 'Task 8', id: 9, isChecked: false }, { task: 'Task 10', id: 11, isChecked: false }],
      Friday: [{ task: 'Task 12', id: 13, isChecked: false }, { task: 'Task 14', id: 15, isChecked: false }],
      Saturday: [{ task: 'Task 16', id: 17, isChecked: false }, { task: 'Task 18', id: 19, isChecked: false }],
      Sunday: [{ task: 'Task 20', id: 21, isChecked: false }, { task: 'Task 22', id: 20, isChecked: false }]
    }
  )

  const storedData = localStorage.getItem("useCounterStore");
  let initialWeekList = storedData ? JSON.parse(storedData).weekList : {};
  let weekList = !Object.values(initialWeekList).length ? initialWeekList = default_list.value : ref(initialWeekList).value;
  console.log(weekList);

  let maxId = Math.max(...Object.values(weekList).flat().map(task => task.id));

  const addTask = (val, day) => {
    maxId += 1;
    let new_id = maxId;
    weekList[day].push({
      task: val,
      id: new_id,
      isChecked: false,
    })

    console.log(new_id);
  }
  return { count, addTask, weekList }

},
  { 
    persist: true, 
  }
)
