import { CreateProject } from "./projects";
import { CreateTask } from "./task";
import { CreateList } from './list';
import { storage } from "./storage";


const UI = {

    loadPage () {
        localStorage.clear();
        //let _list = storage.getList();
        UI.load_default_projects();
        UI.create_temp_projects();
        UI.create_temp_tasks('Today', 'first task')
        UI.create_temp_tasks('Today', 'second task')
        UI.create_temp_tasks('Today', 'third task')
        UI.load_projects();
        UI.init_project_buttons();
    },

    load_projects() {
        const list = storage.getList().getProjects();
        UI.init_projects(list)
    },
    
    load_default_projects () {
        let _list = storage.getList()
        const list = _list.getProjects();
        if (list.length == 0) {
            _list.setProject(CreateProject("Today"))
            _list.setProject(CreateProject("This Week"))
            _list.setProject(CreateProject("This Month"))
            storage.saveList(_list)
        }
        UI.init_default_projects(_list.getProjects())
    },

   init_default_projects(list) {
        const default_projects_container = document.querySelector('.task_by_date')
        list.forEach(project => {
            const name = project.getName()
            const button = document.createElement('button')
            button.classList.add('button', 'project')
            button.textContent = `${name}`
            default_projects_container.appendChild(button)
       });
    },

    init_projects(list) {
    const projects_container = document.querySelector('.projects')
    const add_project = document.querySelector(`.projects > .add-project`)
    list.forEach(project => {
        let name = project.getName();
        if (name !== 'Today' && name !== 'This Week' && name !== 'This Month' ) {
            const button = document.createElement('button')
            button.classList.add('button', 'project')
            button.textContent = `${name}`
            projects_container.insertBefore(button, add_project)
        }
    });
    },

    create_temp_projects () {
        storage.addProject(CreateProject('temp proj 1'))
        storage.addProject(CreateProject('temp proj 2'))
        storage.addProject(CreateProject('temp proj 3'))
        storage.addProject(CreateProject('temp proj 4'))

    },

    create_temp_tasks (project, taskName) {
        storage.addTask(project, CreateTask(taskName))
    },

    load_tasks (e) {
        const projects = storage.getList().getProjects();
        const project = projects.find(project => project.getName() === e.target.innerText)
        const tasks = project.getTasks()
        const task_preview = document.querySelector('.task__box')
        UI.clear_tasks(task_preview)

        // Create elements for each task //
        tasks.forEach(task => {
            const name = task.getName()
            const task_box = document.createElement('div')
                task_box.classList.add('task')
            const task_label = document.createElement('label')
                task_label.classList.add('checkbox')
            const text = document.createTextNode(`${name}`)
            const checkbox_input = document.createElement('input')
                checkbox_input.classList.add('checkbox__input')
                checkbox_input.setAttribute('type', 'checkbox')
            const check_box = document.createElement('div')
                check_box.classList.add('checkbox__box')
            // Date elements //
            const date_label = document.createElement('label')
                date_label.classList.add('task-date')
                date_label.setAttribute('for', 'date')
                date_label.textContent = `Date: `
            const date_input = document.createElement('input')
                date_input.classList.add('date')
                date_input.setAttribute('name', 'date')
                date_input.setAttribute('type', 'date')
            // Insert Task elements in to DOM //
            task_label.append(checkbox_input, check_box, text)
            date_label.append(date_input)
            task_box.append(task_label, date_label)
            task_preview.append(task_box)
        })
    },

    clear_tasks (task_preview) {
        while (task_preview.firstChild) {
            task_preview.removeChild(task_preview.firstChild)
        }
    },

    init_add_task_button () {
        const button = document.querySelector('.button', '.add-task')
    },

    init_project_buttons () {
        const buttons = document.querySelectorAll('button.project')
        buttons.forEach(button => {
            button.addEventListener('click', this.load_tasks, false)
        })
    }

}

export { UI }
