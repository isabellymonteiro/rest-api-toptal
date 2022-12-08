const URL ='http://localhost:3001/tasks'

export const getAllTasks = async () => {
  try {
    const response = await fetch(URL)

    if (!response.ok) throw new Error()

    const data = await response.json()
    return data
  } catch(error) {
    console.log(error) // for now
    return error
  }
}

export const getTaskById = async (taskId) => {
  try {
    const response = await fetch(`${URL}/${taskId}`)

    if (!response.ok) throw new Error()

    const data = await response.json()
    return data
  } catch(error) {
    console.log(error) // for now
  }
}

export const createTask = async (taskContent) => {
  try {
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

    if (!response.ok) throw new Error()
  
    const data = await response.json()
    return data
  } catch(error) {
    console.log(error) // for now
    return error
  }
}

export const updateTask = async (taskId, body)  => {
  try {
    const response = await fetch(`${URL}/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    
    if (!response.ok) throw new Error()
    
    const data = await response.json()
    return data
  } catch(error) {
    console.log(error)
    return error // for now
  }
}

export const removeTask = async (taskId) => {
  try {
    const response = await fetch(`${URL}/${taskId}`, {
      method: 'DELETE'
    })

    if (!response.ok) throw new Error()

    const data = await response.json()
    return data
  } catch(error) {
    console.log(error) // for now
    return error
  }
}