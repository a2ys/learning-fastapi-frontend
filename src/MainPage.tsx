import axios from "axios";
import { useState, useEffect } from "react";
import { Task } from "./models/Task";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";

function MainPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get("http://localhost:8000/api", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.data.User) {
          throw new Error("Invalid token");
        }
      } catch (error) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchData();
    verifyToken();
  }, [navigate]);

  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeWindow, setActiveWindow] = useState<"show" | "create">("create");

  const [dataError, setDataError] = useState<string | null>(null);

  const [newTaskName, setNewTaskName] = useState<string>("");

  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editedTaskName, setEditedTaskName] = useState<string>("");
  const [editedTaskStatus, setEditedTaskStatus] = useState<
    "active" | "completed" | "selectoption"
  >("selectoption");

  const startEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setEditedTaskName(task.task_name);
    setEditedTaskStatus(task.status as "active" | "completed" | "selectoption");
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
  };

  const createTask = async () => {
    const newTask = {
      task_name: newTaskName,
      status: "active",
    };

    try {
      const response = await axios.post<Task>(
        "http://localhost:8000/api/task",
        newTask,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log("Task created:", response.data);
      setNewTaskName("");
      fetchData();
    } catch (error) {
      setDataError("An error occurred");
      console.error("Error creating task:", error);
    }
  };

  const deleteTask = async (taskId: number) => {
    try {
      const response = await axios.delete<Task>(
        `http://localhost:8000/api/task/${taskId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setTasks(
        (prevTasks) => prevTasks?.filter((task) => task.id !== taskId) || []
      );
      console.log("Task deleted:", response.data);
    } catch (error) {
      setDataError("An error occurred");
      console.error("Error deleting task:", error);
    }
  };

  const updateTask = async (taskId: number) => {
    const updatedTask = {
      task_name: editedTaskName,
      status: editedTaskStatus,
    };

    try {
      await axios.put(`http://localhost:8000/api/task/${taskId}`, updatedTask, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const response = await axios.get<Task[]>(
        `http://localhost:8000/api/tasks`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setTasks(response.data);
      setEditingTaskId(null);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get<Task[]>(
        "http://localhost:8000/api/tasks",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks(response.data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="w-screen h-screen">
      <Navbar activeWindow={activeWindow} setActiveWindow={setActiveWindow} />
      <div className="m-4 flex flex-col max-w-2xl mx-auto">
        {activeWindow === "create" && (
          <div className="flex flex-col">
            <p className="font-bold mb-2 text-2xl text-center">
              Create a new task
            </p>
            <input
              type="text"
              placeholder="Task name"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              className="p-3 border-2 border-gray-700 rounded-lg block my-2"
            />
            <button
              onClick={createTask}
              className="px-2 py-3 my-2 bg-blue-950 text-white rounded-lg font-bold"
            >
              Create Task
            </button>
            {dataError && <div>{dataError}</div>}
          </div>
        )}
        {activeWindow === "show" && (
          <div className="flex flex-col w-full">
            <p className="font-bold mb-2 text-2xl text-center">All tasks</p>
            {tasks && tasks.length === 0 && (
              <div className="text-xl font-bold text-red-900">
                No tasks found
              </div>
            )}
            {tasks &&
              tasks.map((task) => (
                <div
                  key={task.id}
                  className="relative px-4 py-2 border-2 border-gray-700 rounded-lg my-2 flex flex-col"
                >
                  {editingTaskId === task.id ? (
                    <>
                      <div className="grid gap-2 my-2">
                        <input
                          type="text"
                          value={editedTaskName}
                          onChange={(e) => setEditedTaskName(e.target.value)}
                          className="p-3 border-2 border-gray-700 rounded-lg block"
                        />
                        <select
                          value={editedTaskStatus}
                          onChange={(e) =>
                            setEditedTaskStatus(
                              e.target.value as "active" | "completed"
                            )
                          }
                          className="p-3 border-2 border-gray-700 rounded-lg block"
                        >
                          <option value="active">Active</option>
                          <option value="completed">Completed</option>
                        </select>
                        <button
                          onClick={() => updateTask(task.id)}
                          className="p-2 bg-green-950 text-white rounded-lg font-bold"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-2 bg-red-950 text-white rounded-lg font-bold"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-full flex justify-between p-2">
                        <h1 className="font-bold inline-block">
                          {task.task_name}
                        </h1>
                        <p
                          className={`font-bold inline-block ${
                            task.status === "active"
                              ? "text-red-800"
                              : "text-green-800"
                          }`}
                        >
                          {task.status.toUpperCase()}
                        </p>
                      </div>
                      <div className="grid gap-2 my-2">
                        <button
                          className="p-2 bg-blue-950 text-white rounded-lg font-bold"
                          onClick={() => startEdit(task)}
                        >
                          Edit
                        </button>
                        <button
                          className="p-2 bg-red-950 text-white rounded-lg font-bold"
                          onClick={() => deleteTask(task.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MainPage;
