
const Project_proto = {
    getName () { return this.project },

    setName (newProject) { return this.project = newProject },
    
    getTasks () { return this.tasks },

    getTask (task) { 
        const name = typeof task === 'string' ? task : task.getName() 
        return this.tasks.find((_task) => _task.getName() === name) },

    setTask (newTask) {
        const name = typeof newTask === 'string' ? newTask : newTask.getName() 
        if (this.tasks.find((task) => task.getName() === name ))
            (window.confirm(`You are about to overwrite ${name}.
            Would you like to proceed?`)) ? this.replaceTask(newTask) : alert('task not saved') ;
        // else
        this.tasks.push(newTask)
    },

    setTasks (tasks) { tasks.forEach(task => this.tasks.push(task)) },

    deleteTask (task) {
        const name = typeof task === 'string' ? task : task.getName() 
        const tempTasks = this.tasks.filter((_task) => _task.getName() !== name)
        for (let i = this.tasks.length-1;  i >= 0;  i--)  this.tasks.pop()
        tempTasks.forEach((_task) => this.tasks.push(_task)) 
    },

    deleteTasks () { for (let i = this.tasks.length-1; i >= 0; i--) this.tasks.pop() },

    replaceTask (newTask) {
        const name = typeof newTask === 'string' ? newTask : newTask.getName()
        if (this.tasks.find((task) => task.getName() === name )) {
            let index = this.tasks.findIndex( element => {
            if (element.name === name) return true });
            this.tasks.splice(index,1,newTask)
        } else {
            this.tasks.push(newTask)
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
