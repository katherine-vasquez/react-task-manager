import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem("tasks");

      if (saved) {
        return JSON.parse(saved);
      }

      return [
        {
          id: 1,
          title: "Arreglarme para ir a la clase",
          description: "Preparar la ropa, desayunar y salir con tiempo.",
          priority: "Alta",
          status: "Pendiente",
        },
        {
          id: 2,
          title: "Asistir a clases",
          description: "Tomar apuntes y participar en las actividades.",
          priority: "Alta",
          status: "Pendiente", // FIX
        },
        {
          id: 3,
          title: "Hacer la tarea de programación",
          description: "Finalizar el ejercicio de React.",
          priority: "Alta",
          status: "Pendiente",
        },
        {
          id: 4,
          title: "Comprar alimentos",
          description: "Comprar frutas, verduras, leche y pan.",
          priority: "Media",
          status: "Pendiente",
        },
        {
          id: 5,
          title: "Llamar a mi mamá",
          description: "Conversar un momento y saludarla.",
          priority: "Media",
          status: "Completada",
        },
        {
          id: 6,
          title: "Hacer ejercicio",
          description: "Caminar o entrenar durante 30 minutos.",
          priority: "Baja",
          status: "Pendiente",
        },
        {
          id: 7,
          title: "Organizar el escritorio",
          description: "Ordenar documentos y limpiar el área de trabajo.",
          priority: "Baja",
          status: "Completada", // FIX
        },
        {
          id: 8,
          title: "Leer un capítulo de el libro de programación",
          description: "Dedicar al menos 20 minutos a la lectura.",
          priority: "Media",
          status: "Completada",
        },
      ];
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
  const [priorityFilter, setPriorityFilter] = useState("Todas");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const filteredTasks = tasks.filter((task) => {
    const matchSearch = task.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchStatus =
      filter === "Todas" ? true : task.status === filter;

    const matchPriority =
      priorityFilter === "Todas"
        ? true
        : task.priority === priorityFilter;

    return matchSearch && matchStatus && matchPriority;
  });

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

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setTitle(task.title);
    setDescription(task.description);
    setPriority(task.priority);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setPriority("Media");
  };

  const total = tasks.length;
  const pendientes = tasks.filter(
    (t) => t.status === "Pendiente"
  ).length;
  const completadas = tasks.filter(
    (t) => t.status === "Completada"
  ).length;

  return (
    <div className="app">

      <header className="header">
        <h1>📋 Gestor de Tareas</h1>
      </header>

      <section className="stats">
        <p>Total: {total}</p>
        <p>Pendientes: {pendientes}</p>
        <p>Completadas: {completadas}</p>
      </section>

      <section className="top-bar">
        <h2>🔍 Buscar y filtrar tareas</h2>

        <input
          placeholder="Buscar tarea..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="Todas">Todos los estados</option>
          <option value="Pendiente">Pendientes</option>
          <option value="Completada">Completadas</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="Todas">Todas las prioridades</option>
          <option value="Alta">Alta</option>
          <option value="Media">Media</option>
          <option value="Baja">Baja</option>
        </select>
      </section>

      <section className="form-card">
        <h2>📝 Nueva tarea</h2>

        <p className="form-text">
          Completa la información para crear una nueva tarea.
        </p>

        <form className="form" onSubmit={handleSubmit}>
          <input
            placeholder="Ingrese el título de la tarea"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Ingrese una descripción"
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
              Cancelar edición
            </button>
          )}
        </form>
      </section>

      <main className="grid">
        <h2>📋 Lista de tareas</h2>

        {filteredTasks.map((task) => (
          <article
            key={task.id}
            className={`card ${task.status}`}
          >
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

      <footer className="footer">
        <p>Gestor de tareas - Proyecto React</p>
      </footer>

    </div>
  );
}