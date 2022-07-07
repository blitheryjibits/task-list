import { format } from 'date-fns';
import parseISO from 'date-fns/parseISO'

const Task_proto = {
    getName() { return this.name; },
    setName(newName) { return this.name = newName; },

    setStatus() { this.status? this.status = false : this.status = true; }, // true if task is completed
    getStatus() { return this.status; },
    
    setDueDate(date) { this.dueDate = date},
    getFormattedDate() {
        return format(parseISO(this.dueDate), 'yyyy-MM-dd');
    },
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
            value: date || new Date(), 
            enumerable:true,
            writable:true
        }
    });
}
    
export { CreateTask, Task_proto };