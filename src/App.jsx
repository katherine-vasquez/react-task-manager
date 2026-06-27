import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  // 💾 ESTADO CON LOCALSTORAGE SEGURO
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem("tasks");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      return [];
    }
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Media");

  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Todas");

  // 💾 GUARDAR EN LOCALSTORAGE
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // 🔍 FILTRADO + BÚSQUEDA
  const filteredTasks = tasks.filter((task) => {
    const matchSearch = task.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchFilter =
      filter === "Todas" ? true : task.status === filter;

    return matchSearch && matchFilter;
  });

  // ➕ CREAR / ✏️ EDITAR
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !description) {
      alert("Completa todos los campos");
      return;
    }

    if (editingId) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingId
            ? { ...t, title, description, priority }
            : t
        )
      );
      setEditingId(null);
    } else {
      const newTask = {
        id: Date.now(),
        title,
        description,
        priority,
        status: "Pendiente",
      };

      setTasks((prev) => [...prev, newTask]);
    }

    setTitle("");
    setDescription("");
    setPriority("Media");
  };

  // 🔄 CAMBIAR ESTADO
  const toggleStatus = (id) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status:
                t.status === "Pendiente"
                  ? "Completada"
                  : "Pendiente",
            }
          : t
      )
    );
  };

  // 🗑️ ELIMINAR
  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // ✏️ INICIAR EDICIÓN
  const startEdit = (task) => {
    setEditingId(task.id);
    setTitle(task.title);
    setDescription(task.description);
    setPriority(task.priority);
  };

  // ❌ CANCELAR EDICIÓN
  const cancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setPriority("Media");
  };

  // 📊 CONTADORES
  const total = tasks.length;
  const pendientes = tasks.filter(t => t.status === "Pendiente").length;
  const completadas = tasks.filter(t => t.status === "Completada").length;

  return (
    <div className="app">

      {/* HEADER */}
      <header className="header">
        <h1>📋 Gestor de Tareas</h1>
      </header>

      {/* STATS */}
      <section className="stats">
        <p>Total: {total}</p>
        <p>Pendientes: {pendientes}</p>
        <p>Completadas: {completadas}</p>
      </section>

      {/* SEARCH + FILTER */}
      <section className="top-bar">
        <input
          placeholder="Buscar tarea..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select onChange={(e) => setFilter(e.target.value)}>
          <option value="Todas">Todas</option>
          <option value="Pendiente">Pendientes</option>
          <option value="Completada">Completadas</option>
        </select>
      </section>

      {/* FORM */}
      <section>
        <form className="form" onSubmit={handleSubmit}>
          <input
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option>Alta</option>
            <option>Media</option>
            <option>Baja</option>
          </select>

          <button type="submit">
            {editingId ? "Guardar cambios" : "Agregar tarea"}
          </button>

          {editingId && (
            <button type="button" onClick={cancelEdit}>
              Cancelar
            </button>
          )}
        </form>
      </section>

      {/* TASKS */}
      <main className="grid">
        {filteredTasks.map((task) => (
          <article key={task.id} className={`card ${task.status}`}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>

            <p><b>Prioridad:</b> {task.priority}</p>
            <p><b>Estado:</b> {task.status}</p>

            <button onClick={() => toggleStatus(task.id)}>
              Cambiar estado
            </button>

            <button onClick={() => deleteTask(task.id)}>
              Eliminar
            </button>

            <button onClick={() => startEdit(task)}>
              Editar
            </button>
          </article>
        ))}
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <p>Gestor de tareas - Proyecto React</p>
      </footer>

    </div>
  );
}