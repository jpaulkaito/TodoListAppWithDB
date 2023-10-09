import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ViewAllTodoPage from './pages/ViewAllTodoPage';
import AboutPage from './pages/AboutPage';
import SearchPage from './pages/SearchPage';
import ContactPage from './pages/ContactPage';
import Header from './components/Header';
import Footer from './components/Footer';
import { baseUrl } from './app/shared/baseUrl';
import './App.css';

async function fetchData() {
  try {
    const response = await fetch(baseUrl);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching todo items:', error);
    throw error;
  }
}

function App() {
  const [todoList, setTodoList] = useState([]);

  useEffect(() => {
    async function fetchDataAsync() {
      try {
        const data = await fetchData();
        setTodoList(data);
      } catch (error) {
        // Handle error if needed
      }
    }

    fetchDataAsync();
  }, []);

  const handleCreate = (newTask) => {
    setTodoList((prevFilteredItems) => [...prevFilteredItems, newTask]);
    // Make a POST request to the server to create a new todo
    fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newTask) // Send the new task as the request body
    })
      .then(response => response.json())
      .then(() => {
        // Fetch the updated todo list from the server
        fetch(baseUrl)
          .then(response => response.json())
          .then(data => setTodoList(data))
          .catch(error => console.error('Error fetching todo items:', error));
      })
      .catch(error => console.error('Error creating todo:', error));
  }

  const handleDelete = (_id) => {
    // Make a DELETE request to the server to delete the todo
    fetch(`${baseUrl}${_id}`, {
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
    console.log('Updated task _id:', updatedTask._id);

    const taskIndex = todoList.findIndex((task) => task._id === updatedTask._id);

    console.log('Task index:', taskIndex);

    if (taskIndex !== -1) {
      setTodoList((prevTodoList) => {
        const updatedList = [...prevTodoList];
        updatedList[taskIndex] = updatedTask;
        return updatedList;
      });

      // Make a PUT request to update the task on the server
      fetch(`${baseUrl}${updatedTask._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedTask)
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .catch(error => console.error('Error updating todo:', error));
    }
  };

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path='TodoListAppWithDB/'
          element={
            <HomePage
              todoList={todoList}
              handleDelete={handleDelete}
              handleCreate={handleCreate}
              handleUpdate={handleUpdate}
            />
          }
        />
        <Route path='TodoListAppWithDB/View-all'
          element={
            <ViewAllTodoPage
              todoList={todoList}
              handleDelete={handleDelete}
              handleUpdate={handleUpdate}
            />
          }
        />
        <Route path='TodoListAppWithDB/Search'
          element={<SearchPage
            todoList={todoList}
            handleDelete={handleDelete}
            handleUpdate={handleUpdate}
          />
          }
        />
        <Route path='TodoListAppWithDB/About'
          element={<AboutPage />}
        />
        <Route path='TodoListAppWithDB/Contact'
          element={<ContactPage />}
        />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
