import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { TODOITEMS } from './app/shared/TODOITEMS';
import HomePage from './pages/HomePage';
import ViewAllTodoPage from './pages/ViewAllTodoPage';
import AboutPage from './pages/AboutPage';
import SearchPage from './pages/SearchPage';
import ContactPage from './pages/ContactPage';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';


function App() {
  const [todoList, setTodoList] = useState([]);

  useEffect(() => {
    // Fetch todo items from the server when the component mounts
    fetch('http://localhost:5000/api/todos/')
      .then(response => response.json())
      .then(data => setTodoList(data))
      .catch(error => console.error('Error fetching todo items:', error));
  }, []);

  const handleCreate = (newTask) => {
    setTodoList((prevFilteredItems) => [...prevFilteredItems, newTask]);
    // Make a POST request to the server to create a new todo
    fetch('http://localhost:5000/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newTask) // Send the new task as the request body
    })
      .then(response => response.json())
      .catch(error => console.error('Error creating todo:', error));
  }

  const handleDelete = (_id) => {
    // Make a DELETE request to the server to delete the todo
    fetch(`http://localhost:5000/api/todos/${_id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(() => {
        // Remove the deleted todo from the todo list
        setTodoList(prevFilteredItems => prevFilteredItems.filter(item => item._id !== _id));
      })
      .catch(error => console.error('Error deleting todo:', error));
  };

  const handleUpdate = (updatedTask) => {
    const taskIndex = todoList.findIndex((task) => task.id === updatedTask.id);

    if (taskIndex !== -1) {
      setTodoList((prevTodoList) => {
        const updatedList = [...prevTodoList];
        updatedList[taskIndex] = updatedTask;
        return updatedList;
      });
    }
  };

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path='TodoListApp/'
          element={
            <HomePage
              todoList={todoList}
              handleDelete={handleDelete}
              handleCreate={handleCreate}
              handleUpdate={handleUpdate}
            />
          }
        />
        <Route path='TodoListApp/View-all'
          element={
            <ViewAllTodoPage
              todoList={todoList}
              handleDelete={handleDelete}
              handleUpdate={handleUpdate}
            />
          }
        />
        <Route path='TodoListApp/Search'
          element={<SearchPage
            todoList={todoList}
            handleDelete={handleDelete}
            handleUpdate={handleUpdate}
          />
          }
        />
        <Route path='TodoListApp/About'
          element={<AboutPage />}
        />
        <Route path='TodoListApp/Contact'
          element={<ContactPage />}
        />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
