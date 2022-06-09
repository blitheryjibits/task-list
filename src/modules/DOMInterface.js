import { CreateProject } from "./projects";
import { CreateTask } from "./task";
import { CreateList } from './list';
import { storage } from "./storage";


const UI = {

    loadPage () {
        localStorage.clear()
        UI.load_projects();
        

    },
    
    load_projects() {
        storage.addProject(CreateProject("new project"));
        storage.addProject(CreateProject("project number 2"));
        const _list = storage.getList();
        const list = _list.getProjects();

        // list[0].setTask(CreateTask("new task"));
        // _list.setProject(list[0])
        // //console.log(_list);
        storage.saveTask(list[0],CreateTask("new task"));

        console.log(localStorage);
        // storage.saveList(_list)
        // console.log(localStorage);
    }
 
}

export { UI }
