import { CreateProject } from "./projects";
import { CreateTask } from "./task";
import { storage } from "./storage";
import { format } from 'date-fns';

//  ToDo
//  - Add function to display all projects

//  - Add description and priority to tasks
//
//  - finish styling with CSS
//      - add any interactive motion
//      - imrpove layout design
//
//  - Fix cross project task naming conflicts. same name tasks shouldn't be able to 
//  change status of other tasks in other projects with the same name.
//  The main issue will be in default date projects... probably.

 
const UI = {

    loadPage () {
        // localStorage.clear();
        UI.load_default_projects();
        UI.create_temp_projects();
        UI.create_temp_tasks();
        UI.load_projects();
        UI.init_add_task_button();
        UI.init_add_project_button();
        storage.update_current(storage.getList().getProject('Today'))
        UI.create_task_preview(storage.getList().getCurrent())
    },
    
    find_current_project () {
        return storage.getList().getCurrent()
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
            _list.setProject(CreateProject("Overdue"))
            storage.saveList(_list)
        }
        UI.init_default_projects(_list.getProjects())
    },

   init_default_projects(list) {
        const default_projects_container = document.querySelector('.task-divider .drop-content')
        list.forEach(project => {
            const a = document.createElement('a')
            a.classList.add('defaut-project')
            a.textContent = `${project.getName()}`
            a.addEventListener('click', UI.load_tasks, false)
            default_projects_container.appendChild(a)
       });
    },

// Displays loaded projects as buttons in API - called in load_projects//
    init_projects(list) {
        const projects_container = document.querySelector('.projects')
        const add_project = document.querySelector(`.add-button-div`)
        // console.log("project container add project button: " + add_project.innerHTML)
        // removes all projects from DOM to avoid repetition
        // doesn't remove the add project button
        while (projects_container.children.length > 1) {
            projects_container.removeChild(projects_container.firstChild)
        }

        list.forEach(project => {
            let name = project.getName();
            if (name !== 'Today' && name !== 'This Week' && name !== 'This Month' && name !== 'Overdue') {
                const project_box = document.createElement('div') 
                    project_box.classList.add('project_box')

                const name_container = document.createElement('div')
                    name_container.classList.add('button', 'project')
                    name_container.textContent = `${name}`
                    name_container.addEventListener('click', this.load_tasks, false)
                const remove = document.createElement('span')
                    remove.classList.add('material-symbols-outlined')
                    remove.textContent = 'delete'
                    remove.addEventListener('click', UI.remove_project, false)
                project_box.append(name_container, remove)
                projects_container.insertBefore(project_box, add_project)
            }
            
        });
    },

// Temporary projects for content on start up //
    create_temp_projects () {
        storage.addProject(CreateProject('House Cleaning'))
        storage.addProject(CreateProject('Car Maintenance'))
    },

    create_temp_tasks () {
        UI.create_temp_task('House Cleaning', 'sweep')
        UI.create_temp_task('Car Maintenance', 'change oil')
        UI.create_temp_task('Car Maintenance', 'replace struts')
    },

    create_temp_task (project, taskName) {
        storage.addTask(project, CreateTask(taskName))
    },
//////////////////////////////////////////////
  
// Logic for loading tasks when a project button is clicked in the API //
    load_tasks (e) {
        const list = storage.getList()
        const project = list.getProject(e.target.innerText)
        storage.update_current(project)
        UI.create_task_preview(project)
    },

    init_add_task_button () {
        const button = document.querySelector('.add-task-button')
        button.addEventListener('click', UI.create_task_form, false)
    },

    init_add_project_button() {
        const add_project = document.querySelector(`.add-project-button`)
        add_project.addEventListener('click', UI.create_project_form, false)
    },

// Create elements for each task and add to DOM for display //
    create_task_preview (project) {
        UI.clear_tasks()
        const task_preview = document.querySelector('.task__box');
        const add_task = document.querySelector('.add-task-button')
        const add_project = document.querySelector('.add-project-button')
        const project_title = document.createElement('div')
            project_title.classList.add('project_title')
            project_title.innerText = project.getName()
        task_preview.append(project_title)
        const tasks = project.getTasks()
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
            const date = UI.create_date_element(task.getFormattedDate())
        
        // Create delete task button //
            const remove = UI.create_remove_button()
        
        // Insert Task elements in to DOM //
            date.lastChild.addEventListener('change', UI.update_date, false)
            checkbox_input.addEventListener('change', UI.update_status, false)
            task_label.append(checkbox_input, check_box, text)
            task_box.append(task_label, date, remove)
            task_preview.append(task_box)
        })
        if (add_task.classList.contains('hide')) add_task.classList.remove('hide')
        if (add_project.classList.contains('hide')) add_project.classList.remove('hide')
    },

    // change task preview to innerhtml = ''
    clear_tasks () {
        const task_preview = document.querySelector('.task__box')
        task_preview.innerHTML = ''
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

    create_remove_button () {
        const remove = document.createElement('div')
        remove.classList.add('remove_task')
        const bin = document.createElement('span')
            bin.classList.add('material-symbols-outlined')
            bin.textContent = 'delete'
            bin.addEventListener('click', this.remove_task, false)
        remove.append(bin)
        return remove
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
            submit_button.classList.add('submit')
            submit_button.textContent = `Submit`
        const cancel_button = document.createElement('button')
            cancel_button.setAttribute('type', 'reset')
            cancel_button.classList.add('cancel')
            cancel_button.textContent = `Cancel`
        
        label.append(input)
        form.append(label, submit_button, cancel_button)
        div.append(form)
        return div
    },

// Project form is for adding new projects to storage //
    create_project_form () {
        document.querySelector('.add-project-button').classList.add('hide')
        document.querySelector('.add-task-button').classList.add('hide')
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
        const submit_button = div.querySelector('.submit-form > button')
        const task_box = document.querySelector('.task__box')
        document.querySelector('.add-task-button').classList.add('hide')
       
    // Date elements //
        const date = UI.create_date_element(format(Date.now(), 'yyyy-MM-dd'));

    // Display form //    
        form.insertBefore(date, submit_button)
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
        UI.create_task_preview(storage.getProject(project))
        document.querySelector('.add-task-button').classList.remove('hide')
        e.preventDefault()
    },
    
    log_project_submit (e) {
    // Create new project and set to current project
        const project_name = e.target[0].value
        const new_project = CreateProject(project_name)
        storage.addProject(new_project)
        storage.update_current(new_project)
        UI.remove_form()
        UI.load_projects()
        // create task view
        e.preventDefault()
    },

    remove_form () {
        const task_box = document.querySelector('.task__box')
        task_box.removeChild(document.querySelector('.div-form'))
        document.querySelector('.add-task-button').classList.remove('hide')
        document.querySelector('.add-project-button').classList.remove('hide')
    },

    update_date (e) {
        const date = e.target.value
        const name = e.target.parentNode.parentNode.children[0].innerText
        const project = storage.getList().getCurrent()
        const task = project.getTask(name)
        storage.update_task_date(project, task, date)
        UI.create_task_preview(storage.getProject(project))
    },

    update_status (e) {
        const task = e.target.parentNode.innerText
        storage.update_status(task)
    },

    remove_project (e) {
        console.log(e.target.parentNode.children[0].innerText)
        const project_name = e.target.parentNode.children[0].innerText
        storage.deleteProject(project_name)
        UI.load_projects()
    },

    remove_task (e) {
        const task_name = e.target.parentNode.parentNode.children[0].innerText
        const project = storage.getList().getCurrent()
        storage.deleteTask(task_name)
        UI.create_task_preview(storage.getProject(project))
    }
}

export { UI }
