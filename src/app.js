import { createTask, getAllTasks, removeTask, updateTask } from './api'

const form = document.getElementById('add-task__form')
const todoTaskList = document.getElementById('todo-tasks__list')
const completedTaskList = document.getElementById('completed-tasks__list')

getAllTasks().then(tasksData => {
  if (tasksData instanceof Error) {
    alert('Something went wrong getting your tasks')
    return
  }

  tasksData.map(taskData => createTaskElement(taskData))
})

// if task comes with completed on first fetch
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

  const taskData = await createTask(taskInputContent)

  if (taskData instanceof Error) {
    alert('Something went wrong, please try again')
    return
  }

  createTaskElement(taskData)
}

const createTaskElement = (taskData) => {
  const taskTemplate = document.getElementById('task__template')
  const clone = taskTemplate.content.cloneNode(true)

  const taskTitle = clone.querySelector('.task__title')
  taskTitle.value = taskData.title

  const taskDescription = clone.querySelector('.task__description')
  taskDescription.value = taskData.description

  const taskCheckbox = clone.querySelector('.task__checkbox')
  taskCheckbox.checked = taskData.done

  const taskEditElements = {
    title: taskTitle,
    description: taskDescription,
    editButton: clone.querySelector('.task__edit-button')
  }

  taskCheckbox.addEventListener('click', (e) => updateTaskStatus(e, taskData.id))
  clone.querySelector('.task__edit-button').addEventListener('click', (e) => editTask(taskData.id, taskEditElements))
  clone.querySelector('.task__delete-button').addEventListener('click', (e) => deleteTask(e, taskData.id))

  if (taskCheckbox.checked) {
    clone.querySelector('.task').classList.add('task--completed')
    completedTaskList.appendChild(clone)
  } else {
    todoTaskList.appendChild(clone)
  }
}

const updateTaskStatus = async (e, taskId) => {
  const response = await updateTask(taskId, { done: e.target.checked })

  if (response instanceof Error) {
    alert('Something went wrong, please try again')
    return
  }

  const taskItem = e.target.closest('li')

  if (e.target.checked) {
    taskItem.classList.add('task--completed')
    completedTaskList.insertBefore(taskItem, completedTaskList.firstChild)
  } else {
    taskItem.classList.remove('task--completed')
    todoTaskList.insertBefore(taskItem, todoTaskList.firstChild)
  }
}

const editTask = async (taskId, taskEditElements) => {
  const { title, description, editButton } = taskEditElements

  if (editButton.ariaLabel.toLowerCase() === 'edit task') {
    title.readOnly = false
    description.readOnly = false
    editButton.ariaLabel = 'Confirm changes'
    editButton.firstElementChild.src = 'img/confirm.svg'
  } else {
    title.readOnly = true
    description.readOnly = true
    editButton.ariaLabel = 'Edit task'
    editButton.firstElementChild.src = 'img/edit.svg'

    const response = await updateTask(taskId, { 
      title: title.value, 
      description: description.value 
    })

    if (response instanceof Error) {
      alert('Something went wrong, please try again')
      return
    }
  }
}

const deleteTask = async (e, taskId) => {
  const response = await removeTask(taskId)

  if (response instanceof Error) {
    alert('Something went wrong, please try again')
    return
  }

  e.target.closest('li').remove()
}
