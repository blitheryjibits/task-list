import { format, isDate } from 'date-fns';

const taskFactory = (name) => {
    let description = "";
    let dueDate = "no date";

    const getName = () => { return name; }
    const setName = (newName) => { name = newName; }

    const setDescription = (details) => { description = details; }
    const getDescription = () => { return description; }

    const setDueDate = (date) => { dueDate = date; }
    const getFormattedDate = () => {
        if (isDate(dueDate)) return format(dueDate, 'dd MMM yyyy');
    }
    
    return { getName, setName, getDescription, setDescription, setDueDate, getFormattedDate }
}

export default { taskFactory };