import React, { useState, useEffect } from "react";
import TaskService from "./TaskService";
import "../css/App.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faExclamationTriangle, faTrash } from "@fortawesome/free-solid-svg-icons";
import { faSquare } from "@fortawesome/free-regular-svg-icons";

const TaskApp: React.FC = () => {
  const taskService = new TaskService();

  const [tasks, setTasks] = useState<string[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [taskStatus, setTaskStatus] = useState<string[]>([]);
  const [taskIcons, setTaskIcons] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const storedTasks = taskService.getTasks();
    const storedStatus = taskService.getTaskStatus();

    const initialTaskStatus = storedStatus.map((status) => {
      switch (status) {
        case "À faire":
          return (
            <FontAwesomeIcon icon={faSquare} className="task-icon-gray" />
          );
        case "À corriger":
          return (
            <FontAwesomeIcon icon={faExclamationTriangle} className="task-icon-orange" />
          );
        case "Fait":
          return (
            <FontAwesomeIcon icon={faCheck} className="task-icon-green" />
          );
        default:
          return (
            <FontAwesomeIcon icon={faSquare} className="task-icon-gray" />
          );
      }
    });

    setTasks(storedTasks);
    setTaskStatus(storedStatus);
    setTaskIcons(initialTaskStatus);
  }, []);

  const confirmRemoveTask = (index: number) => {
    const shouldRemove = window.confirm("Do you really want to delete this task?");
    if (shouldRemove) {
      removeTask(index);
    }
  };

  const addTask = () => {
    if (newTask.trim() !== "") {
      taskService.addTask(newTask);
      
      const newTasks = [...tasks, newTask];
      setTasks(newTasks);
      
      const newTaskStatus = [...taskStatus, "À faire"];
      setTaskStatus(newTaskStatus);
  
      const newTaskIcons = [...taskIcons];
      newTaskIcons.push(
        <FontAwesomeIcon icon={faSquare} className="task-icon-gray" />
      );
      setTaskIcons(newTaskIcons);
      
      setNewTask("");
    }
  };

  const removeTask = (index: number) => {
    taskService.removeTask(index);
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);

    const newTaskStatus = [...taskStatus];
    newTaskStatus.splice(index, 1);
    setTaskStatus(newTaskStatus);

    const newTaskIcons = [...taskIcons];
    newTaskIcons.splice(index, 1);
    setTaskIcons(newTaskIcons);
  };

  const handleTaskDoubleClick = (index: number) => {
    setEditingIndex(index);
  };

  const handleTaskBlur = (index: number) => {
    setEditingIndex(null);
    const updatedTasks = [...tasks];
    if (updatedTasks[index].trim() === "") {
      removeTask(index);
    } else {
      taskService.editTask(index, updatedTasks[index]);
    }
  };

  const toggleTaskStatus = (index: number) => {
    const newTaskStatus = [...taskStatus];
    const newTaskIcons = [...taskIcons];
    switch (newTaskStatus[index]) {
      case "À faire":
        newTaskStatus[index] = "À corriger";
        newTaskIcons[index] = (
          <FontAwesomeIcon icon={faExclamationTriangle} className="task-icon-orange" />
        );
        taskService.toggleTaskStatus(index, newTaskStatus[index]); 
        break;
      case "À corriger":
        newTaskStatus[index] = "Fait";
        newTaskIcons[index] = (
          <FontAwesomeIcon icon={faCheck} className="task-icon-green" />
        );
        taskService.toggleTaskStatus(index, newTaskStatus[index]);
        break;
      case "Fait":
        newTaskStatus[index] = "À faire";
        newTaskIcons[index] = (
          <FontAwesomeIcon icon={faSquare} className="task-icon-gray" />
        );
        taskService.toggleTaskStatus(index, newTaskStatus[index]);
        break;
      default:
        break;
    }
    setTaskStatus(newTaskStatus);
    setTaskIcons(newTaskIcons);
  };
  

  return (
    <div className="task-list-container">
      <h1>Task Manager</h1>
      <ul>
        {tasks.map((task, index) => (
          <li key={index} className="task-item">
            <div className="task-square"></div>
            {editingIndex === index ? (
              <input
                type="text"
                value={task}
                onBlur={() => handleTaskBlur(index)}
                autoFocus
                onChange={(e) => {
                  const updatedTasks = [...tasks];
                  updatedTasks[index] = e.target.value;
                  setTasks(updatedTasks);
                }}
              />
            ) : (
              <>
                <span onDoubleClick={() => handleTaskDoubleClick(index)}>{task}</span>
              </>
            )}
            <div className="task-icon" onClick={() => toggleTaskStatus(index)}>
              {taskIcons[index]}
            </div>
            <div onClick={() => confirmRemoveTask(index)}>
  <FontAwesomeIcon icon={faTrash} className="task-icon-red" />
</div>
          </li>
        ))}
      </ul>
      <div className="add-task">
        <input className="add"
          type="text"
          placeholder="New task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button className="add-button" onClick={addTask}>
          Add a task
        </button>
      </div>
    </div>
  );
};

export default TaskApp;