import { format, isDate, toDate } from 'date-fns';
import parseISO from 'date-fns/parseISO'

const Task_proto = {
    getName() { return this.name; },
    setName(newName) { return this.name = newName; },

    setDescription(details) { return this.description = details; },
    getDescription() { return this.description; },
    
    setDueDate(date) { this.dueDate = parseISO(date)},
    getFormattedDate() {
        return format(parseISO(this.dueDate), 'yyyy-MM-dd');
    },

    setPriority(level) { 
        if (this.priority.length > 0) this.priority.pop()
        this.priority.push(level)
    },

    getPriority() { return this.priority}
}

const CreateTask = (name, date) => {
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
            value: date || new Date(), 
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