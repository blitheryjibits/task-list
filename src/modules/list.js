import projectFactory from './projects'

const List_proto = {
    getProjects () { return this.projects },
    
    getProject (projectName) { 
        return this.projects.find((project) => 
        project.getName() === projectName) 
    },
    
    setProject (project) { this.projects.push(project) },

    setProjects (projects) { 
        projects.forEach(project => 
        this.projects.push(project)) 
    },
    
    deleteProject  (projectName) { 
        let tempArray = this.projects.filter((project) => project.getName() !== projectName);
        for (let i = this.projects.length-1; i >= 0; i--) this.projects.pop();
        tempArray.forEach(project => this.projects.push(project));
    },

    deleteProjects () { for (let i = this.projects.length-1; i >= 0; i--) this.projects.pop() }
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