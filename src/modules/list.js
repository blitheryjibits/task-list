import { format, parseISO, isSameWeek, isSameMonth, compareAsc } from 'date-fns';


const List_proto = {

    getProjects () { return this.projects },
    
    getProject (project) {
        const name = typeof project === 'string' ? project : project.getName()
        return this.projects.find((_project) => 
        _project.getName() === name)
    },

    setCurrent (project) { 
        this.getProjects().forEach( (item) => { if (item.getCurrent()) item.setCurrent()})
        this.getProject(project).setCurrent()},
    
    getCurrent () {
        return this.getProjects().find( (project) => project.getCurrent())
    },
    
    setProject (project) { 
        if (this.projects.find((existing) => existing.getName() === project.getName())) 
            return console.log(`${project.getName()} already exists`);
        this.projects.push(project); 
        
    },

    setProjects (projects) { 
        projects.forEach(project => 
        this.projects.push(project)) 
    },
    
    deleteProject  (projectName) { 
        let tempArray = this.projects.filter((project) => project.getName() !== projectName);
        for (let i = this.projects.length-1; i >= 0; i--) this.projects.pop();
        tempArray.forEach(project => this.projects.push(project));
    },

    deleteProjects () { for (let i = this.projects.length-1; i >= 0; i--) this.projects.pop() },

// Adds new tasks to the daily, weekly, and monthly project lists
    update_dates (new_task) {
        const list = this.getProjects()
        const dates = [ this.getProject('Today'), this.getProject('This Week'), this.getProject('This Month') ]
        const overdue = this.getProject('Overdue')
        const projects = list.filter(project => project !== dates[0] && project !== dates[1] && project !== dates[2] && project !== overdue)
        const new_task_name = new_task.getName()
        const today = format(new Date(), 'yyyy-MM-dd')
        let found;

        projects.forEach(project => {
            const tasks = project.getTasks()
            tasks.forEach(task => {
                const task_date = task.getFormattedDate()
                if (task_date === today) dates[0].replaceTask(task)
                if (isSameWeek(parseISO(task_date), parseISO(today), {weekStartsOn: 1})) dates[1].replaceTask(task)
                if (isSameMonth(parseISO(task_date), parseISO(today))) dates[2].replaceTask(task)
            })    
        })
    // Propogates changes to task dates through default (timed) projects
        dates.forEach(project => {
            found = project.getTasks().find(task => task.getName() === new_task_name) 
            found? project.replaceTask(new_task) : project.setTask(new_task);
        })
        return list
    },

// Adds any projects from the daily, weekly, and monthly projects to the overdue list when passed due date 
    check_dates () {
        const list = this.getProjects()
        const today = format(new Date(), 'yyyy-MM-dd')
        const dates = [ this.getProject('Today'), this.getProject('This Week'), this.getProject('This Month'), this.getProject('Overdue') ]
        
        dates.forEach(project => {
            const project_name = project.getName()
            const tasks = project.getTasks()
            tasks.forEach(task => {
                const task_date = task.getFormattedDate()
        // check today
                if (project_name === 'Today' 
                && task_date !== today) {
                    dates[3].replaceTask(task)
                    dates[0].deleteTask(task)
                }
        // check week
                if (project_name === 'This Week' 
                && !isSameWeek(parseISO(task_date), parseISO(today), {weekStartsOn: 1})) {
                    dates[3].replaceTask(task)
                    dates[1].deleteTask(task)
                }
        // check month
                if (project_name === 'This Month' 
                && !isSameMonth(parseISO(task_date), parseISO(today))) {
                    dates[3].replaceTask(task)
                    dates[2].deleteTask(task)
                }
        // check overdue
                if (project_name === 'Overdue' 
                && task_date > today) {
                    dates[3].deleteTask(task)
                }
            })
        })
        return list
    },

    update_status(task) {
        const list = this.getProjects()
        const task_name = typeof task === 'string' ? task : task.getName()
        let found;
        list.forEach(project => {
            project.getTasks().find(_task => _task.getName() === task_name)?.setStatus()
            })
        return list
    }

}


const CreateList = () => {
    return Object.create(List_proto, {
        projects: { 
            value: [], 
            enumerable: true,
            writable: true,
        },
    })
}

export { CreateList };