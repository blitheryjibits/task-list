
const Project_proto = {
    getName () { return this.name },

    setName (newName) { return this.name = newName },
    
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
        if (this.tasks.find((task) => task.getName() === newTask.getName() )) {
            let index = this.tasks.findIndex( element => {
            if (element.name === newTask.getName()) return true });
            this.tasks.splice(index,1,newTask)
        } else {
            this.tasks.push(newTask)
        }
    },

    setCurrent () { this.current === false ? this.current = true : this.current = false},
    getCurrent () { return this.current }
}

const CreateProject = (name) => {
    return Object.create(Project_proto, {
        name: { 
            value: name, 
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
