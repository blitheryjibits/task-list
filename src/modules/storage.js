import { CreateProject } from "./projects";
import { CreateTask } from "./task";
import { CreateList } from './list';
import { format, addWeeks, addMonths } from 'date-fns';

// the storage object acts as a database interface. It utilises functions from the respective
// modules to reflect changes made to data in storage, making data consistent with 
// changes made in the User Interface.
const storage = {

    saveList (data) { 
        if (localStorage.getItem('list') !== null) localStorage.removeItem('list')
        localStorage.setItem('list', JSON.stringify(data)) },
    
    getList () { 
        if (localStorage.getItem('list') === null) { this.saveList(CreateList()); }
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
        _list.deleteProject(typeof project === 'string' ? project : project.getName());
        this.saveList(_list);
    },

    renameProject (project, name) {
        this.getProject(project.getName()).setName(name);
        this.saveList(_list);
    },

////////////// Functions for accessing Tasks in Local Storage //////////////

    addTask (project, task) {
    // this function uses the project related to the task in task.project to ensure that the 
    // project containing the task is updated when the task is altered in the 
    // default project view.
        task.setProject(typeof project === 'string' ? project : project.getName());
        const _list = this.getList();
        const _project = _list.getProject(project)
        _project.setTask(task) 
        this.saveList(_list);
    },

    getTask (project, task) {
        return this.getList().getProject(project === typeof 'string'? project : project.getName())
        .getTask(task)
    },

    deleteTask (project, task) {
        const _list = this.getList();
        _list.getProject(project).deleteTask(task)
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
        this.saveList(_list)
    },

    update_status (project, task) {
        const _list = this.getList();
        _list.update_status(project, task)
        this.saveList(_list)
    },

    update_current (project) {
        let _list = this.getList();
        _list.setCurrent(project)
        _list = this.update_default(_list)
        this.saveList(_list)
    },

    // removes stale tasks from default project
    update_default (list) {
        if (list.getProject('default') !== undefined) {
            list.getProject('default').deleteTasks()
        }
        return list
    },

    // filters all project tasks by a selected date.
    // sends filtered tasks back to DOMInterface for display.
    // also, updates default project with filtered tasks so any changes made in
    // the filtered view can be reflected in the original project holding the task.
    filter_dates(date) {
        const today = format(new Date(), 'yyyy-MM-dd')
        const week = format(addWeeks(new Date(), 1), 'yyyy-MM-dd')
        const month = format(addMonths(new Date(), 1), 'yyyy-MM-dd')
        if (date instanceof Date) { const alternateDate = format(date, 'yyyy-MM-dd') }
        let tasks = []
        this.getList().getProjects().forEach(project => {
            if (project.getName() === 'default') return
            switch (date) {
                case 'Today':
                    tasks = tasks.concat(project.getTasks().filter(task => task.getFormattedDate() == today))
                    break;
                case 'This Week':
                    tasks = tasks.concat(project.getTasks().filter(task => task.getFormattedDate() < week))
                    break;
                case 'This Month':
                    tasks = tasks.concat(project.getTasks().filter(task => task.getFormattedDate() < month))
                    break;
                case 'Overdue':
                    tasks = tasks.concat(project.getTasks().filter(task => task.getFormattedDate() < today))
                    break;
                default:
                    tasks = tasks.concat(project.getTasks().filter(task => task.getFormattedDate() === alternateDate))
                    break;
            }
        })
        this.update_current(date);
        const list = this.getList();
        list.getProject('default').setAllTasks(tasks)
        this.saveList(list)
        return tasks;
    }

}

export { storage };