import { CreateProject } from "./projects";
import { CreateTask } from "./task";
import { CreateList } from './list';

const storage = {

    saveList (data) { 
        if (localStorage.getItem('list') !== null) this.deleteList();
        localStorage.setItem('list', JSON.stringify(data)) },
    
    getList () { 
        if (localStorage.getItem('list') === null) this.saveList(CreateList());
        const _list = Object.assign(CreateList(), JSON.parse(localStorage.getItem('list')));
        
        //Retrieve Projects and change __proto__
        const tempProjects = _list.getProjects().map(project => Object.assign(CreateProject(), project))
        _list.deleteProjects()
        _list.setProjects(tempProjects)
        
        // Retrieve tasks and change __proto__
        _list.getProjects().forEach(project => {
            let tempTasks = project.getTasks()
            if ( tempTasks.length > 0 ) {
                tempTasks.map(task => Object.assign(CreateTask(), {task}));
                project.deleteTasks();
                project.setTasks(tempTasks)
                
                }
            });

        return _list;
     },

    deleteList () {
        localStorage.removeItem('list');
    },

    addProject (project) { 
        const _list = this.getList();
        _list.setProject(project);
        this.saveList(_list);
     },

    getProject (project) {
        const _list = this.getList();
        return typeof project === 'string' ? _list.getProject(project) : _list.getProject(project.getName());
    },

    deleteProject (project) {
        const _list = this.getList();
        _list.deleteProject(project.getName());
        this.saveList(_list);
    },

    renameProject (project, name) {
        const _list = this.getList();
        _list.getProject(project.getName()).setName(name);
        this.saveList(_list);
    },

    saveTask (project, task) {
        const _list = this.getList();
        // _list.getProject(project.getName()).setTask(task)
        project.setTask(task)
        _list.setProject(project)
        this.saveList(_list);
    },
    getTask () {},
    deleteTask () {},
    renameTask () {}
}

export { storage };