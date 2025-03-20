import React, { useState, useEffect } from 'react';
import { todo_list_backend } from '../../declarations/todo_list_backend';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch todos on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const todoList = await todo_list_backend.get_todos();
      setTodos(todoList);
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      await todo_list_backend.add_todo(newTodo);
      setNewTodo('');
      fetchTodos();
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const handleToggleComplete = async (id, completed) => {
    try {
      await todo_list_backend.update_todo(id, !completed);
      fetchTodos();
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await todo_list_backend.delete_todo(id);
      fetchTodos();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(Number(timestamp / 1000n)).toLocaleString();
  };

  return (
    <div className="todo-app">
      <h1>Web3 To-Do List</h1>
      <p className="subtitle">Powered by Internet Computer Protocol</p>
      
      <form onSubmit={handleAddTodo} className="todo-form">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task..."
          className="todo-input"
        />
        <button type="submit" className="add-button">Add</button>
      </form>

      {loading ? (
        <p className="loading">Loading todos...</p>
      ) : (
        <ul className="todo-list">
          {todos.length === 0 ? (
            <p className="empty-list">No tasks yet. Add one above!</p>
          ) : (
            todos.sort((a, b) => Number(b.created_at - a.created_at)).map((todo) => (
              <li key={todo.id.toString()} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                <div className="todo-content">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleComplete(todo.id, todo.completed)}
                    className="todo-checkbox"
                  />
                  <span className="todo-title">{todo.title}</span>
                  <span className="todo-date">{formatDate(todo.created_at)}</span>
                </div>
                <button 
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default TodoApp;
