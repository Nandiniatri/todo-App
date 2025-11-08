import { useEffect, useState } from "react";
import axios from "axios";
import "./TodoApp.css"; 

const API_URL = "http://localhost:4000";

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");

  const fetchTodos = async () => {
    try {
      const res = await axios.get(`${API_URL}/todos`);
      setTodos(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const res = await axios.post(`${API_URL}/todos`, { title });
      setTodos([...todos, res.data]);
      setTitle("");
    } catch (err) {
      console.error("Add error:", err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/todos/${id}`);
      setTodos(todos.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const updateTodo = async (id, updatedTodo) => {
    try {
      const res = await axios.put(`${API_URL}/todos/${id}`, updatedTodo);
      setTodos(todos.map((t) => (t.id === id ? res.data : t)));
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  return (
    <div className="todo-container">
      <h1 className="todo-title">📝 To-Do List</h1>

      <form onSubmit={addTodo} className="todo-form">
        <input
          type="text"
          placeholder="Add a new task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="todo-input"
        />
        <button type="submit" className="todo-add-btn">
          Add
        </button>
      </form>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className="todo-item">
            <input
              type="checkbox"
              checked={todo.is_completed}
              onChange={() =>
                updateTodo(todo.id, {
                  ...todo,
                  is_completed: !todo.is_completed,
                })
              }
            />
            <input
              type="text"
              value={todo.title}
              onChange={(e) =>
                updateTodo(todo.id, { ...todo, title: e.target.value })
              }
              className={`todo-text ${
                todo.is_completed ? "completed" : ""
              }`}
            />
            <button
              onClick={() => deleteTodo(todo.id)}
              className="todo-delete-btn"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
