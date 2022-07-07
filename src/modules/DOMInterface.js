import { CreateProject } from "./projects";
import { CreateTask } from "./task";
import { storage } from "./storage";
import { format } from 'date-fns';

//  ToDo
//  - Display current project name at top of task box
//  - remove ridiculous projects and task, 
//      - replace with reasonable task and project
//  - finish styling with CSS
//      - add any interactive motion
//  - Attempt to refactor code
//
//  - Add remove/delete buttons for projects and tasks
//  - determine storage and placement of finished
//  - Convert default projects to dropdown menu that displays the projects when selected
//      - Remove listeners and add button when in displaying default projects
 
const UI = {

    loadPage () {
        localStorage.clear();
        UI.load_default_projects();
        UI.create_temp_projects();
        UI.create_temp_tasks();
        UI.load_projects();
        UI.init_add_task_button();
        UI.init_add_project_button();
        let _list = storage.getList();
        _list.setCurrent(_list.getProject('Today'))
        storage.saveList(_list)
    },
    
    find_current_project () {
        return storage.getList().getCurrent()
    },


    load_projects() {
        const list = storage.getList().getProjects();
        UI.init_projects(list)
        UI.init_project_buttons()
    },
    
    load_default_projects () {
        let _list = storage.getList()
        const list = _list.getProjects();
        if (list.length == 0) {
            _list.setProject(CreateProject("Today"))
            _list.setProject(CreateProject("This Week"))
            _list.setProject(CreateProject("This Month"))
            _list.setProject(CreateProject("Overdue"))
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

// Displays loaded projects as buttons in API - called in load_projects//
    init_projects(list) {
        const projects_container = document.querySelector('.projects')
        while (projects_container.children.length > 1) {
            projects_container.removeChild(projects_container.firstChild)
        }
        const add_project = document.querySelector(`.projects > .add-project`)
        list.forEach(project => {
            let name = project.getName();
            if (name !== 'Today' && name !== 'This Week' && name !== 'This Month' && name !== 'Overdue') {
                const button = document.createElement('button')
                button.classList.add('button', 'project')
                button.textContent = `${name}`
                projects_container.insertBefore(button, add_project)
            }
        });
    },

// Temporary projects for content on start up //
    create_temp_projects () {
        storage.addProject(CreateProject('temp proj 1'))
        storage.addProject(CreateProject('temp proj 2'))
    },

    create_temp_tasks () {
        UI.create_temp_task('Today', 'first task')
        UI.create_temp_task('Today', 'second task')
        UI.create_temp_task('Today', 'third task')
    },

    create_temp_task (project, taskName) {
        storage.addTask(project, CreateTask(taskName))
    },
//////////////////////////////////////////////
  
// Logic for loading tasks when a project button is clicked in the API //
    load_tasks (e) {
        const list = storage.getList()
        const project = list.getProject(e.target.innerText)
        list.setCurrent(project)
        const tasks = project.getTasks()
        UI.clear_tasks()
        UI.create_task_preview(tasks)
        storage.saveList(list)
    },
    
    init_project_buttons () {
        const buttons = document.querySelectorAll('button.project')
        buttons.forEach(button => {
            button.addEventListener('click', this.load_tasks, false)
        })
    },

    init_add_task_button () {
        const button = document.querySelector('button.add-task')
        button.addEventListener('click', UI.create_task_form, false)
    },

    init_add_project_button() {
        const add_project = document.querySelector(`.projects > .add-project`)
        add_project.addEventListener('click', UI.add_new_project, false)
    },

    add_new_project() {
        UI.create_project_form()
    },

// Create elements for each task and add to DOM for display //
    create_task_preview (tasks) {
        const task_preview = document.querySelector('.task__box')
        tasks.forEach(task => {
            const task_box = document.createElement('div')
                task_box.classList.add('task')
            const task_label = document.createElement('label')
                task_label.classList.add('checkbox-and-label-container')
            const text = document.createTextNode(`${task.getName()}`)
        // Create checkbox //
            const checkbox_input = document.createElement('input')
                checkbox_input.classList.add('checkbox__input')
                checkbox_input.setAttribute('type', 'checkbox')
            const check_box = document.createElement('div')
                check_box.classList.add('checkbox__box')
                checkbox_input.checked = task.getStatus()
        // Date elements //
            const date = UI.create_date_element(task.getFormattedDate());
        
        // Insert Task elements in to DOM //
            date.lastChild.addEventListener('change', UI.update_date, false)
            checkbox_input.addEventListener('change', this.update_status, false)
            task_label.append(checkbox_input, check_box, text)
            task_box.append(task_label, date)
            task_preview.append(task_box)
        })
    },

    clear_tasks () {
        const task_preview = document.querySelector('.task__box')
        while (task_preview.firstChild) {
            task_preview.removeChild(task_preview.firstChild)
        }
    },

    create_date_element (date) {
        const date_label = document.createElement('label')
            date_label.classList.add('task-date')
            date_label.setAttribute('for', 'date')
            date_label.textContent = `Date: `
        const date_input = document.createElement('input')
            date_input.classList.add('date')
            date_input.setAttribute('name', 'date')
            date_input.setAttribute('type', 'date')
            date_input.value = date
        date_label.append(date_input)
        return date_label
    },

    create_partial_form () {
        const div = document.createElement('div')
            div.classList.add('div-form')
        const form = document.createElement('form')
            form.classList.add('submit-form')
        const label = document.createElement('label')
        const input = document.createElement('input')
            input.setAttribute('type', 'text')
        const submit_button = document.createElement('button')
            submit_button.setAttribute('type', 'submit')
            submit_button.textContent = `Submit`
        const cancel_button = document.createElement('button')
            cancel_button.setAttribute('type', 'reset')
            cancel_button.textContent = `Cancel`
        
        label.append(input)
        form.append(label, submit_button, cancel_button)
        div.append(form)
        return div
    },

// Project form is for adding new projects to storage //
    create_project_form () {
        const task_box = document.querySelector('.task__box')
        const div = UI.create_partial_form()
    // Display form //   
        UI.clear_tasks();
        task_box.append(div)
        const form = document.querySelector('.submit-form')
            form.classList.add('project')
            form.addEventListener('submit', UI.log_project_submit)
            form.addEventListener('reset', UI.remove_form)
    },

// Task form is for adding new tasks to storage //
    create_task_form () {
        const div = UI.create_partial_form()
        const form = div.querySelector('.submit-form')
        const button = div.querySelector('.submit-form > button')
        const task_box = document.querySelector('.task__box')
       
    // Date elements //
        const date = UI.create_date_element(format(Date.now(), 'yyyy-MM-dd'));

    // Display form //    
        form.insertBefore(date, button)
        form.addEventListener('submit', UI.log_submit)
        form.addEventListener('reset', UI.remove_form)
        div.append(form)
        task_box.append(div)
    },

    log_submit (e) {
        // Create new task and add to current project
        const task_name = e.target[0].value
        const task_date = e.target[1].value
        const new_task = CreateTask(task_name)
        const project = storage.getList().getCurrent()
        new_task.setDueDate(task_date)
        storage.addTask(project, new_task)
        storage.update_task_date(project, task_name, task_date) 
        UI.remove_form()
        UI.clear_tasks()
        UI.create_task_preview(storage.getProject(project).getTasks())
        e.preventDefault()
    },
    
    log_project_submit (e) {
        // Create new project and set to current project
        const project_name = e.target[0].value
        const new_project = CreateProject(project_name)
        storage.addProject(new_project)
        storage.update_current(new_project)
        UI.remove_form()
        UI.clear_tasks()
        UI.load_projects()
        e.preventDefault()
    },

    remove_form () {
        const task_box = document.querySelector('.task__box')
        task_box.removeChild(document.querySelector('.div-form'))
    },

    update_date (e) {
        const date = e.target.value
        const name = e.target.parentNode.parentNode.children[0].innerText
        const project = storage.getList().getCurrent()
        const task = project.getTask(name)
        storage.update_task_date(project, task, date)
    },

    update_status (e) {
        const task = e.target.parentNode.innerText
        // const project = storage.getList().getCurrent()
        // const task = project.getTask(name)
        storage.update_status(task)
    }

}

export { UI }
