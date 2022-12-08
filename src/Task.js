import { deleteTask, updateTask } from './api'

const todoTaskList = document.getElementById('todo-tasks__list')
const completedTaskList = document.getElementById('completed-tasks__list')

export class Task {
  constructor(task) {
    this.id = task.id
    this.title = task.title
    this.description = task.description
    this.done = task.done

    this.template = document.getElementById('task__template')
    this.clone = this.template.content.cloneNode(true)
  }

  create() {
    const task = this.clone.querySelector('.task')
    task.dataset.id = this.id

    const taskTitle = this.clone.querySelector('.task__title')
    taskTitle.value = this.title

    const taskDescription = this.clone.querySelector('.task__description')
    taskDescription.value = this.description

    const taskCheckbox = this.clone.querySelector('.task__checkbox')
    taskCheckbox.checked = this.done

    taskCheckbox.addEventListener('click', (e) => this.updateStatus(e))
    this.clone.querySelector('.task__edit-button').addEventListener('click', () => this.edit())
    this.clone.querySelector('.task__delete-button').addEventListener('click', (e) => this.delete(e))
    
    if (taskCheckbox.checked) {
      task.classList.add('task--completed')
      completedTaskList.appendChild(this.clone)
    } else {
      todoTaskList.insertBefore(this.clone, todoTaskList.firstElementChild)
    }
  }

  async updateStatus(e) {
    try {
      await updateTask(this.id, { done: e.target.checked })
      this.done = e.target.checked
  
      const taskItem = e.target.closest('li')
  
      if (this.done) {
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

  async edit() {
    const task = document.querySelector(`[data-id="${this.id}"]`)
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

      this.title = taskTitle.value
      this.description = taskDescription.value

      try {
        await updateTask(this.id, { 
          title: taskTitle.value, 
          description: taskDescription.value 
        })

        this.title = taskTitle.value
        this.description = taskDescription.value
      } catch(error) {
        alert(error.message)
      }
    }
  }

  async delete(e) {
    try {
      await deleteTask(this.id)
      e.target.closest('li').remove()
    } catch(error) {
      alert(error.message)
    }
  }
}