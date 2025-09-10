'use client'

import { useState } from "react";
import './List.css';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const List = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');

  const addToDo = () => {
    if (input.trim()) {
      const newTodo: Todo = {
        id: Date.now(),
        text: input,
        completed: false
      };
      setTodos([...todos, newTodo]);
      setInput('');
    }
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const activeCount = todos.length - completedCount;

  return (
    <div className="todo-container">
      <h1 className="todo-title">📝 My Todo List</h1>
      
      <div className="todo-input-container">
        <input
          type="text"
          placeholder="What needs to be done?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addToDo()}
          className="todo-input"
        />
        <button onClick={addToDo} className="add-button">
          ➕ Add
        </button>
      </div>

      <div className="todo-stats">
        <span>Total: {todos.length}</span>
        <span>Active: {activeCount}</span>
        <span>Completed: {completedCount}</span>
      </div>

      <div className="todo-list">
        {todos.map(todo => (
          <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              className="todo-checkbox"
            />
            <span className="todo-text">{todo.text}</span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="delete-button"
              aria-label="Delete todo"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      {completedCount > 0 && (
        <button onClick={clearCompleted} className="clear-button">
          🧹 Clear Completed ({completedCount})
        </button>
      )}

      {todos.length === 0 && (
        <div className="empty-state">
          <p>🎉 No todos yet! Add one above to get started.</p>
        </div>
      )}
    </div>
  );
}

export default List;