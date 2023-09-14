class TaskService {
  private storageKey = "tasks";
  private statusKey = "taskStatus"; 

  private getStoredTasks(): string[] {
    const storedTasks = localStorage.getItem(this.storageKey);
    return storedTasks ? JSON.parse(storedTasks) : [];
  }

  private getStoredTaskStatus(): string[] {
    const storedStatus = localStorage.getItem(this.statusKey);
    return storedStatus ? JSON.parse(storedStatus) : [];
  }

  getTasks(): string[] {
    return this.getStoredTasks();
  }

  getTaskStatus(): string[] {
    return this.getStoredTaskStatus();
  }

  private updateStoredTasks(tasks: string[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(tasks));
  }

  private updateStoredTaskStatus(status: string[]): void {
    localStorage.setItem(this.statusKey, JSON.stringify(status));
  }

  toggleTaskStatus(index: number, status: string): void {
    const taskStatus = this.getStoredTaskStatus();
    taskStatus[index] = status;
    this.updateStoredTaskStatus(taskStatus);
  }

  addTask(newTask: string): void {
    const tasks = this.getStoredTasks();
    tasks.push(newTask);
    this.updateStoredTasks(tasks);
    
    const taskStatus = this.getStoredTaskStatus();
    taskStatus.push("À faire");
    this.updateStoredTaskStatus(taskStatus);
  }

  removeTask(index: number): void {
    const tasks = this.getStoredTasks();
    tasks.splice(index, 1);
    this.updateStoredTasks(tasks);
    
    const taskStatus = this.getStoredTaskStatus();
    taskStatus.splice(index, 1); 
    this.updateStoredTaskStatus(taskStatus);
  }

  editTask(index: number, newText: string): void {
    const tasks = this.getStoredTasks();
    tasks[index] = newText;
    this.updateStoredTasks(tasks);
  }
}

export default TaskService;
