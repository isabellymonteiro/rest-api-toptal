const URL = 'http://localhost:3001/tasks'

export const getAllTasks = async () => {
    const response = await fetch(URL)

    if (!response.ok) throw new Error('Something went wrong getting your tasks, please try again')

    const data = await response.json()
    return data
}

// not being used
export const getTaskById = async (taskId) => {
  const response = await fetch(`${URL}/${taskId}`)

  if (!response.ok) throw new Error('Something went wrong getting your task, please try again')

  const data = await response.json()
  return data
}

export const createTask = async (taskContent) => {
  const response = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...taskContent,
      done: false
    })
  })

  if (!response.ok) throw new Error('Something went wrong creating the task, please try again')

  const data = await response.json()
  return data
}

export const updateTask = async (taskId, body)  => {
  const response = await fetch(`${URL}/${taskId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  
  if (!response.ok) throw new Error('Something went wrong updating the task, please try again')
  
  const data = await response.json()
  return data
}

export const deleteTask = async (taskId) => {
  const response = await fetch(`${URL}/${taskId}`, {
    method: 'DELETE'
  })

  if (!response.ok) throw new Error('Something went wrong deleting the task, please try again')

  const data = await response.json()
  return data
}