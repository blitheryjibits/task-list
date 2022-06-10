
const Project_proto = {
    getName () { return this.name },

    setName (newName) { return this.name = newName },
    
    getTasks () { return this.tasks },

    getTask (taskName) { return this.tasks.find((task) => task.getName() === taskName) },

    setTask (newTask) {
        if (this.tasks.find((task) => task.getName() === newTask.getName() ))
            return console.log(`${newTask.getName()} already exists`);
        this.tasks.push(newTask)
    },

    setTasks (tasks) { tasks.forEach(task => this.tasks.push(task)) },

    deleteTask (taskName) {
        let tempTasks = this.tasks.filter((task) => task.getName() !== taskName)
        for (let i = this.tasks.length-1; i >= 0; i--) this.tasks.pop()
        tempTasks.forEach((task) => this.tasks.push(task)) 
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
    }
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
        }
    })
}

export { CreateProject, Project_proto };
