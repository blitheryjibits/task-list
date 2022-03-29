

const factoryProject = (name) => {

    let tasks = []
    // might have to change to let if it doesn't allow changes to array

    const getName = () => {
        return name;
    }

    const setName = newName => {
        name = newName;
    }
    
    const getTasks = () => {
        return tasks;
    }

    const getTask = taskName => {
        return tasks.find((task) => task.getName === taskName);
    }

    const setTask = newTask => {
        if (tasks.find((task) => task.getName === newTask.name)) return
        tasks.push(newTask);
    }

    const deleteTask = taskName => {
        tasks = tasks.filter((task) => task.getName !== taskName);
    }
    return { getName, setName, getTask, getTasks, setTask, deleteTask };
}

export default { factoryProject };
