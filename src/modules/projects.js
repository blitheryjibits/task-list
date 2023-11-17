
const Project_proto = {
    getName () { return this.project },

    setName (newProject) { return this.project = newProject },
    
    getTasks () { return this.tasks },

    getTask (task) { 
        const name = typeof task === 'string' ? task : task.getName() 
        return this.tasks.find((_task) => _task.getName() === name) },

    setTask (newTask) {
        const name = typeof newTask === 'string' ? newTask : newTask.getName() 
        if (this.tasks.find((task) => task.getName() === name )) {
            this.replaceTask(newTask) 
        } else {
            this.tasks.push(newTask)
        }
    },

    setTasks (tasks) { 
        tasks.forEach(task => {
        this.setTask(task)
        })
    },

    setAllTasks (tasks) {
        tasks.forEach(task => {
            this.tasks.push(task)
        })
    },

    deleteTask (task) {
        const name = typeof task === 'string' ? task : task.getName();
        const taskIndex = this.tasks.findIndex((task) => task.getName() === name);
        if (taskIndex !== -1) { this.tasks.splice(taskIndex, 1); }
    },

    deleteTasks () { this.tasks = [] },

    
    replaceTask (newTask) {
        const name = typeof newTask === 'string' ? newTask : newTask.getName()
        const existingTaskIndex = this.tasks.findIndex((task) => task.getName() === name);

        if (existingTaskIndex !== -1) {
            // Replace the existing task with the new task
            this.tasks.splice(existingTaskIndex, 1, newTask);
        } else {
            // Add the new task if it doesn't exist
            this.tasks.push(newTask);
        }
    },

    setCurrent () { this.current === false ? this.current = true : this.current = false},
    getCurrent () { return this.current }
}

const CreateProject = (project) => {
    return Object.create(Project_proto, {
        project: { 
            value: project, 
            enumerable:true,
            writable: true
        },
        tasks: { 
            value: [], 
            enumerable:true,
            writable: true
        },
        current: {
            value: false, 
            enumerable:true,
            writable: true
        }
    })
}

export { CreateProject, Project_proto };
