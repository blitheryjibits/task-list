import { CreateProject } from "./projects";
import { CreateTask } from "./task";
import { storage } from "./storage";
import { format } from 'date-fns';

//  ToDo
//  - Add description and priority to tasks

// Add sorting function, sort by date or alphabetically

//  - Fix delete function for the default projects using the attribute value of divs.
//  - change functions and implementations so only task and project objects are passed
//  in place of strings.

// separate DOM concerns to reduce the size of this file.

// Create drag and drop feature for reordering tasks and projects

 
const UI = {

    // loads all projects from storage and initializes the list of tasks
    // from Today project as default
    loadPage () {
        UI.create_temp_projects();  // placeholder projects
        UI.create_temp_tasks();     // placeholder tasks
        UI.init_default_projects(); // projects that show tasks based on timeframe i.e., day, week
        UI.load_projects();
        UI.init_add_task_button();
        UI.init_add_project_button();
    },

    load_projects() {     
        UI.init_projects(storage.getList().getProjects())
    },

   init_default_projects() {
        const default_projects_container = document.querySelector('.task-divider .drop-content')
        const drop_menu_projects = ['Today', 'This Week', 'This Month', 'Overdue']
        drop_menu_projects.forEach(project => {
            const a = document.createElement('a')
            a.textContent = project
            a.addEventListener('click', UI.filter_dates, false)
            default_projects_container.appendChild(a)
        })
        storage.addProject(CreateProject('default'));
        storage.update_current('default');
        default_projects_container.firstElementChild.click();
    },

    filter_dates(e) {
        const date = e.target.innerText;
        const tasks = storage.filter_dates(date);
        const project = CreateProject(date);
        project.setAllTasks(tasks);
        UI.create_task_preview(project);

    },

// Displays loaded projects as buttons in API - called in load_projects//
    init_projects(list) {
        const projects_container = document.querySelector('.projects')
        const add_project = document.querySelector(`.add-button-div`)
        
        // removes all projects from DOM to avoid repetition
        // doesn't remove the add project button
        while (projects_container.children.length > 1) {
            projects_container.removeChild(projects_container.firstChild)
        }
        // Adds projects to view
        list.forEach(project => {
            let project_name = project.getName();
            if (project_name == 'default') {return}
                const project_box = document.createElement('div') 
                    project_box.classList.add('project_box')

                const name_container = document.createElement('div')
                    name_container.classList.add('button', 'project')
                    name_container.textContent = `${project_name}`
                    name_container.addEventListener('click', this.load_tasks, false)
                const remove = document.createElement('span')
                    remove.classList.add('material-symbols-outlined')
                    remove.textContent = 'delete'
                    remove.addEventListener('click', UI.remove_project, false)
                project_box.append(name_container, remove)
                projects_container.insertBefore(project_box, add_project)
            }
            
        );
    },

//////////// Temporary projects for content on start up ////////////
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
        
        // create task elements
        const tasks = project.getTasks()
        tasks.forEach(task => {
            const task_box = document.createElement('div')
                task_box.classList.add('task')
                task_box.setAttribute('data-value', task.getProject())
            const task_label = document.createElement('label')
                task_label.classList.add('checkbox-and-label-container')
            const task_name_holder = document.createElement('p')
                task_name_holder.innerText = task.getName()
                UI.make_editable(task_name_holder)

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
            checkbox_input.addEventListener('click', UI.update_status, false)
            task_label.append(checkbox_input, check_box)
            task_box.append(task_label, task_name_holder, date, remove) //, edit)
            task_preview.append(task_box)
        })
        if (add_task.classList.contains('hide')) add_task.classList.remove('hide')
        if (storage.getList().getCurrent().getName() == 'default') add_task.classList.add('hide')
        if (add_project.classList.contains('hide')) add_project.classList.remove('hide')
    },

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
        new_task.setProject(project.getName())
        storage.addTask(project, new_task)
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
        UI.create_task_preview(new_project)
        e.preventDefault()
    },

    remove_form () {
        const task_box = document.querySelector('.task__box')
        task_box.removeChild(document.querySelector('.div-form'))
        document.querySelector('.add-task-button').classList.remove('hide')
        document.querySelector('.add-project-button').classList.remove('hide')
    },

    update_date (e) {
        const div = e.target
        const date = div.value
        const taskbox = div.parentNode.parentNode
        const name = taskbox.children[1].innerText
        const project = taskbox.getAttribute('data-value')
        const display_project = taskbox.parentNode.children[0].innerText
        storage.update_task_date(project, name, date)
        const temp_project = CreateProject(display_project)
        temp_project.setAllTasks(storage.filter_dates(display_project))
        UI.create_task_preview(temp_project)
    },

    update_status (e) {
        const task = e.target.parentNode.parentNode.children[1].innerText
        console.log(task)
        const project = e.target.parentNode.parentNode.getAttribute('data-value')
        storage.update_status(project, task)
    },

    remove_project (e) {
        console.log(e.target.parentNode.children[0].innerText)
        const project_name = e.target.parentNode.children[0].innerText
        storage.deleteProject(project_name)
        UI.load_projects()
    },

    remove_task (e) {
        const task_name = e.target.parentNode.parentNode.children[1].innerText
        const task_project = e.target.parentNode.parentNode.getAttribute('data-value')
        const current_project = document.querySelector('div.project_title').innerText
        storage.deleteTask(task_project, task_name)

        if (current_project !== storage.getList().getCurrent()) {
            const temp_project = CreateProject(current_project)
            temp_project.setAllTasks(storage.filter_dates(current_project))
            UI.create_task_preview(temp_project)  
        } else {
            UI.create_task_preview(storage.getProject(project))
        }
    },

    make_editable(div) {
          
          div.addEventListener('click', () => {
            // Enable editing when clicked
            div.contentEditable = 'true';
            const current_name = div.innerText
            div.setAttribute('data-value', current_name)
          });
          
          div.addEventListener('blur', () => {
            // Disable editing when focus is lost
            div.contentEditable = 'false';
            const task = div.getAttribute('data-value')
            const new_task_name = div.innerText
            const project = div.parentNode.getAttribute('data-value')
            div.removeAttribute('data-value')
            storage.renameTask(project, task, new_task_name)
          });
         

    }

}

export { UI }
