import { format, isDate, toDate } from 'date-fns';


const Task_proto = {
    getName() { return this.name; },
    setName(newName) { return this.name = newName; },

    setDescription(details) { return this.description = details; },
    getDescription() { return this.description; },
    
    setDueDate(date) { return this.dueDate.value = date },
    getFormattedDate() {
        if (isDate(this.dueDate.value)) 
        return format(this.dueDate.value, 'dd MMM yyyy');
    },

    setPriority(level) { 
        if (this.priority.length > 0) this.priority.pop()
        this.priority.push(level)
    },

    getPriority() { return this.priority}
}

const CreateTask = (name) => {
    return Object.create(Task_proto, {
        name: { 
            value: name, 
            enumerable:true,
            writable:true
        },
        description: { 
            value: "no description", 
            enumerable:true,
            writable:true
        },
        dueDate: {
            value: Date, 
            enumerable:true,
            writable:true
        },
        priority: {
            value: 'none', 
            enumerable:true,
            writable:true
        }
    });
}
    
export { CreateTask, Task_proto };