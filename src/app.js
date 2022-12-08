import { createTask, getAllTasks, removeTask, updateTask } from './api'

const form = document.getElementById('add-task__form')
const todoTaskList = document.getElementById('todo-tasks__list')
const completedTaskList = document.getElementById('completed-tasks__list')


;(async () => {
  try {
    const tasksData = await getAllTasks()
    tasksData.forEach(taskData => createTaskElement(taskData))
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
    createTaskElement(taskData)
  } catch(error) {
    alert(error.message)
  }
}

const createTaskElement = (taskData) => {
  const taskTemplate = document.getElementById('task__template')
  const clone = taskTemplate.content.cloneNode(true)

  const task = clone.querySelector('.task')
  task.dataset.id = taskData.id

  const taskTitle = clone.querySelector('.task__title')
  taskTitle.value = taskData.title

  const taskDescription = clone.querySelector('.task__description')
  taskDescription.value = taskData.description

  const taskCheckbox = clone.querySelector('.task__checkbox')
  taskCheckbox.checked = taskData.done

  taskCheckbox.addEventListener('click', (e) => updateTaskStatus(e, taskData.id))
  clone.querySelector('.task__edit-button').addEventListener('click', () => editTask(taskData.id))
  clone.querySelector('.task__delete-button').addEventListener('click', (e) => deleteTask(e, taskData.id))

  if (taskCheckbox.checked) {
    clone.querySelector('.task').classList.add('task--completed')
    completedTaskList.appendChild(clone)
  } else {
    todoTaskList.appendChild(clone)
  }
}

const updateTaskStatus = async (e, taskId) => {
  try {
    await updateTask(taskId, { done: e.target.checked })

    const taskItem = e.target.closest('li')

    if (e.target.checked) {
      taskItem.classList.add('task--completed')
      completedTaskList.insertBefore(taskItem, completedTaskList.firstChild)
    } else {
      taskItem.classList.remove('task--completed')
      todoTaskList.insertBefore(taskItem, todoTaskList.firstChild)
    }
  } catch(error) {
    alert(error.message)
  }
}

const editTask = async (taskId) => {
  const task = document.querySelector(`[data-id="${taskId}"]`)
  const taskTitle = task.querySelector('.task__title')
  const taskDescription = task.querySelector('.task__description')
  const editTaskButton = task.querySelector('.task__edit-button')
  const editTaskImage = editTaskButton.firstElementChild

  if (editTaskButton.ariaLabel.toLowerCase() === 'edit task') {
    taskTitle.readOnly = false
    taskDescription.readOnly = false
    editTaskButton.ariaLabel = 'Confirm changes'
    editTaskImage.src = 'img/confirm.svg'
  } else {
    taskTitle.readOnly = true
    taskDescription.readOnly = true
    editTaskButton.ariaLabel = 'Edit task'
    editTaskImage.src = 'img/edit.svg'

    try {
      await updateTask(taskId, { 
        title: taskTitle.value, 
        description: taskDescription.value 
      })
    } catch(error) {
      alert(error.message)
    }
  }
}

const deleteTask = async (e, taskId) => {
  try {
    await removeTask(taskId)
    e.target.closest('li').remove()
  } catch(error) {
    alert(error.message)
  }
}
