import { CreateProject } from "./projects";
import { CreateTask } from "./task";
import { CreateList } from './list';
import { storage } from "./storage";
import { format, isDate, toDate } from 'date-fns';
import parseISO from 'date-fns/parseISO'

 
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
        UI.init_add_task_button(); 
    },
    
    project_pointer (project) {
        const current_project = project
        const update = (project) => {current_project = project}
        const get = () => {return current_project}
        return {update, get}
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
// Displays loaded projects as buttons in API - called in load_projects//
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
///////////////////////////////////////////
        const current_project = UI.project_pointer({project})
        console.log(current_project.get())
        UI.clear_tasks()
        UI.create_task_preview(tasks)
    },

// Create elements for each task and add to DOM for display //
    create_task_preview (tasks) {
        const task_preview = document.querySelector('.task__box')
        tasks.forEach(task => {
            //const name = task.getName()
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
        // Date elements //
            const date = UI.create_date_element(task.getFormattedDate());
        
        // Insert Task elements in to DOM //
            date.lastChild.addEventListener('change', UI.update_date, false)
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

    init_add_task_button () {
        const button = document.querySelector('button.add-task')
        button.addEventListener('click', UI.create_task_form, false)
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

// Task form is for adding new tasks to storage //
    create_task_form () {
        const task_box = document.querySelector('.task__box')
        const div = document.createElement('div')
            div.classList.add('div-form')
        const form = document.createElement('form')
            form.classList.add('task-submit-form')
        const label = document.createElement('label')
        const input =  document.createElement('input')
            input.setAttribute('type', 'text')
        const submit_button = document.createElement('button')
            submit_button.setAttribute('type', 'submit')
            submit_button.textContent = `Submit`
        const cancel_button = document.createElement('button')
            cancel_button.setAttribute('type', 'reset')
            cancel_button.textContent = `Cancel`
    // Date elements //
        const date = UI.create_date_element(format(Date.now(), 'yyyy-MM-dd'));
    // Display form //    
        label.append(input)
        form.append(label, date, submit_button, cancel_button)
        form.addEventListener('submit', UI.log_submit)
        form.addEventListener('reset', UI.log_cancel_submit)
        div.append(form)
        task_box.append(div)
    },

    log_submit (e) {
        const task_name = e.target[0].value
        const task_date = e.target[1].value
        const new_task = CreateTask(task_name)
        new_task.setDueDate(task_date)
        storage.addTask('Today', new_task)
        UI.remove_form()
        e.preventDefault()
    },

    log_cancel_submit (e) {
        UI.remove_form()
    },

    remove_form () {
        const task_box = document.querySelector('.task__box')
        task_box.removeChild(document.querySelector('.div-form'))
    },

    update_date (e) {
        const date = e.target.value
        const name = e.target.parentNode.parentNode.children[0].innerText
        console.log(name)
    },

    init_project_buttons () {
        const buttons = document.querySelectorAll('button.project')
        buttons.forEach(button => {
            button.addEventListener('click', this.load_tasks, false)
        })
    }

}

export { UI }
