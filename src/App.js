import { useState ,useEffect } from 'react';
import { BrowserRouter as Router , Route , Routes } from 'react-router-dom';
import './App.css';
import AddTask from './component/AddTask';
import Header from './component/Header';
import Tasks from './component/Tasks';
import Footer from './component/Footer';
import About from './component/About';

function App() {
  const [showAddTask , setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const getTasks = async () =>
    {
      const taskFromServer = await fetchTasks();
      setTasks(taskFromServer)
    }
      getTasks()
  },[])

  // fetch data
    const fetchTasks = async () =>
    {
      const res = await fetch ('http://localhost:5000/tasks')
      const data =await res.json();

      return data
    }

    // fetch data
    const fetchTask = async (id) =>
    {
      const res = await fetch (`http://localhost:5000/tasks/${id}`)
      const data = await res.json();

      return data
    }

  //Add Task Function
  const addTask = async (task)=>
  {
   const res = await fetch('http://localhost:5000/tasks' , {
    method: 'POST',
    headers: {
      'Content-type' : 'application/json'
    },
    body: JSON.stringify(task),
   })  
   const data = await res.json();

   setTasks([...tasks , data])
  }

  //Delete Function
  const deleteTasks = async (id)=>
  {
     await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'DELETE',
    })
    setTasks(tasks.filter((task) => task.id !== id))
  }
  // Toggle Reminder
  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id)
    const updTask = { ...taskToToggle, reminder: !taskToToggle.reminder }

    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(updTask),
    })

    const data = await res.json()

    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, reminder: data.reminder } : task
      )
    )
  }

  return (
  <Router>
    <div className='container'>
      <Header
        onAdd={() => setShowAddTask(!showAddTask)}
        showAdd={showAddTask}
      />
      <Routes>
        <Route
          path='/'
          element={
            <>
              {showAddTask && <AddTask onAdd={addTask} />}
              {tasks.length > 0 ? (
                <Tasks
                  tasks={tasks}
                  onDelete={deleteTasks}
                  onToggle={toggleReminder}
                />
              ) : (
                'No Tasks To Show'
              )}
            </>
          }
        />
        <Route path='/about' element={<About />} />
      </Routes>
      <Footer />
    </div>
  </Router>
)
}

export default App;
