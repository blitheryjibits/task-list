import { format } from 'date-fns';

const Task_proto = {
    getName() { return this.name; },
    setName(newName) { return this.name = newName; },

    setStatus() { this.status? this.status = false : this.status = true; },
    getStatus() { return this.status; },
    
    setDueDate(date) { typeof date === 'Date' ? this.dueDate = format(date, 'yyyy-MM-dd') : this.dueDate = date},
    getFormattedDate() { return (this.dueDate); },

    setDescription(details) {this.description = details},
    getDescription() {return this.description},

    setPriority(priority_level) {this.priority = priority_level},
    getPriority() {return this.priority}
}

const CreateTask = (name, date) => {
    return Object.create(Task_proto, {
        name: { 
            value: name, 
            enumerable:true,
            writable:true
        },
        status: { 
            value: false, 
            enumerable:true,
            writable:true
        },
        dueDate: {
            value: date || format(new Date(), 'yyyy-MM-dd'), 
            enumerable:true,
            writable:true
        },
        description: {
            value: '',
            enumerable: true,
            writable: true
        },
        priority: {
            value: ''
        }
    });
}
    
export { CreateTask, Task_proto };