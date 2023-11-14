
const List_proto = {

    getProjects () { return this.projects },
    
    getProject (project) {
        const name = typeof project === 'string' ? project : project.getName()
        return this.projects.find((_project) => 
        _project.getName() === name)
    },

    setCurrent (project) { 
        const dates = ['Today', 'This Week', 'This Month', 'Overdue']
        // Check if a project is already set to current or not. Mainly for initializaiton
        // of default projects.
        if (this.getCurrent() !== undefined) {
            this.getCurrent().setCurrent();
        }
        // check if the project is an existing project or a default project (which doesn't
        //  exist because it is a filter function)
        if ((dates.find((date) =>  date == project))) {
            this.getProject('default').setCurrent()
        } else {
            this.getProject(project).setCurrent()
        }
    },
    
    getCurrent () {
        return this.getProjects().find( (project) => project.getCurrent())
    },
    
    setProject (project) { 
        const project_name = typeof project.getName() === 'string' ? project.getName() : project; 
        if (this.projects.find((existing) => existing.getName() === project_name)) return;
        this.projects.push(project); 
        
    },

    setProjects (projects) { 
        projects.forEach(project => 
        this.projects.push(project)) 
    },

    
    deleteProject  (projectName) { 
        this.projects = this.projects.filter(project => project.getName() !== projectName);
    },

    deleteProjects () { this.projects = [] },

    update_status(project, task) {
        const _task = this.getProject(project).getTask(task)
        if(_task.getProject() === project) {
            _task.setStatus()
        } else {
            this.getProject(_task.getProject()).getTask(_task).setStatus()
        }

        return this
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