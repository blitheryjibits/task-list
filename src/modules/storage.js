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
            let tempTasks = project.getTasks().map(task => Object.assign(CreateTask(), task));
                project.deleteTasks();
                project.setTasks(tempTasks)
            });

        return _list;
     },

    deleteList () {
        localStorage.removeItem('list');
    },

    // Functions for accessing Projects in Local Storage //
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

    // Functions for accessing Tasks in Local Storage //
    addTask (project, task) {
        const _list = this.getList();
        typeof project === 'string' ?
        _list.getProject(project).setTask(task) :
        _list.getProject(project.getName()).setTask(task);
        _list.update_dates(task)
        this.saveList(_list);
    },

    getTask (project, task) {
        const _list = this.getList();
        return _list.getProject(project === typeof 'string'?project: project.getName())
        .getTask(task)
    },

    deleteTask (project, task) {
        const _list = this.getList();
        _list.getProject(project).deleteTask(task);
        this.saveList(_list);
    },

    renameTask (project, task, newName) {
        const _list = this.getList();
        _list.getProject(project).getTask(task).setName(newName);
        this.saveList(_list);
    },
    
    update_task_date (project, task, date) {
        const _list = this.getList();
        _list.getProject(project).getTask(task).setDueDate(date)
        const new_task =  _list.getProject(project).getTask(task)
        _list.update_dates(new_task)
        _list.check_dates()
        this.saveList(_list)
    },

    update_status (task) {
        const _list = this.getList();
        _list.update_status(task)
        this.saveList(_list)
    },

    update_current (project) {
        const _list = this.getList();
        _list.setCurrent(project)
        this.saveList(_list)
    }

}

export { storage };