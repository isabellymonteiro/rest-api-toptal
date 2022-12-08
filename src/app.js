import { createTask, getAllTasks } from './api'
import { Task } from './Task'

const form = document.getElementById('add-task__form')

;(async () => {
  try {
    const tasksData = await getAllTasks()
    tasksData.forEach(taskData => {
      const task = new Task(taskData)
      task.create()
    })
  } catch(error) {
    alert(error.message)
  }
})()

form.addEventListener('submit', (e) => {
  e.preventDefault()

  const formData = new FormData(e.target)
  e.target.reset()
  
 addTask(Object.fromEntries(formData))
})

const addTask = async (taskInputContent) => {
  if (!taskInputContent.title.trim() || !taskInputContent.description.trim()) {
    alert('Please, add task title and description')
    return
  }

  try {
    const taskData = await createTask(taskInputContent)
    const newTask = new Task(taskData)
    newTask.create()
  } catch(error) {
    alert(error.message)
  }
}