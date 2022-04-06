import { CreateProject } from "./modules/projects";
import { CreateTask } from "./modules/task";
import { CreateList } from './modules/list';
import { storage } from "./modules/storage";


const testTask = CreateTask('test-task');
const testTask_2 = CreateTask('test-task-2');
const testProject = CreateProject('test-project');
const testProject_2 = CreateProject('test-project-2');
const testList = CreateList();

//console.log(testProject.__proto__);
testTask.setDueDate(new Date());
//console.log(testTask.getFormattedDate());
//console.log(testTask.getName());
testProject.setTask(testTask);
testProject.setTask(testTask_2);

// console.log((((testList.getProject('test-project')).getTasks())[1]).getName());
//console.log(testProject.getTask('test-task'));
//console.log(testProject.getTask('test-task-2').getFormattedDate());

testList.setProject(testProject);
testList.setProject(testProject_2);
localStorage.clear();

storage.saveList(testList);

//console.log(storage.getList())

storage.addProject(CreateProject('test-p-3'))
storage.renameProject(testProject, 'test-p-1')
console.log(storage.getProject('test-p-1'))

