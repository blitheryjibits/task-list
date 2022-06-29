import { format, parseISO, isSameWeek } from 'date-fns';


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


    // Create new Date, get all projects and for each, 
    // check today date and this week (mon -> sun) and month (1 -> last day)
    // if in date, make copy and add to today and/or week projects and/or month
    // use storage interface to save list in local storage
    update_today () {
        const today = this.getProject('Today')
        const list = this.getProjects()
        const date = format(new Date(), 'yyyy-MM-dd')
        list.forEach(project => {
            const tasks = project.getTasks()
            tasks.forEach(task => {
                if (task.getFormattedDate() === date) {
                    today.replaceTask(task)
                }
            })
        })
        return today
    },
    update_week () {
        const week = this.getProject('This Week')
        const list = this.getProjects()
        const date = format(new Date(), 'yyyy-MM-dd')
        list.forEach(project => {
            const tasks = project.getTasks()
            tasks.forEach(task => {
                if (isSameWeek(parseISO(task.getFormattedDate()), parseISO(date), {weekStartsOn: 1})) 
                    week.replaceTask(task)
            })
        })
        return week
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