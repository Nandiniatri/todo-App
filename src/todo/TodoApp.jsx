import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:4000";

export default function TodoApp() {
    const [todos, setTodos] = useState([]);
    const [title, setTitle] = useState("");

    // ✅ Fetch todos
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

    // ✅ Add todo
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

    // ✅ Delete todo
    const deleteTodo = async (id) => {
        try {
            await axios.delete(`${API_URL}/todos/${id}`);
            setTodos(todos.filter((t) => t.id !== id));
        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    // ✅ Update todo (title or is_completed)
    const updateTodo = async (id, updatedTodo) => {
        try {
            const res = await axios.put(`${API_URL}/todos/${id}`, updatedTodo);
            setTodos(todos.map((t) => (t.id === id ? res.data : t)));
        } catch (err) {
            console.error("Update error:", err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
            <h1 className="text-3xl font-bold mb-6">📝 To-Do List</h1>

            <form onSubmit={addTodo} className="mb-4 flex gap-2">
                <input
                    className="border rounded p-2 w-64"
                    type="text"
                    placeholder="Add a new task..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600"
                >
                    Add
                </button>
            </form>

            <ul className="w-96">
                {todos.map((todo) => (
                    <li
                        key={todo.id}
                        className="flex justify-between items-center bg-white shadow p-2 mb-2 rounded"
                    >
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
                            className={`flex-1 mx-2 outline-none ${todo.is_completed ? "line-through text-gray-500" : ""
                                }`}
                            value={todo.title}
                            onChange={(e) =>
                                updateTodo(todo.id, { ...todo, title: e.target.value })
                            }
                        />
                        <button
                            onClick={() => deleteTodo(todo.id)}
                            className="text-red-500 font-bold hover:text-red-700"
                        >
                            ✕
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
