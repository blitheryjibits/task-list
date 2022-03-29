import projectFactory from "./modules/projects";
import taskFactory from "./modules/task";
import  list from './modules/list';

const testTask = taskFactory.taskFactory('test-task');
const testTask_2 = taskFactory.taskFactory('test-task-2');
const testProject = projectFactory.projectFactory('test-project');
const testList = list.list();

testTask.setDueDate(new Date());

testProject.setTask(testTask);
testProject.setTask(testTask_2);
testList.setProject(testProject);

console.log((((testList.getProject('test-project')).getTasks())[1]).getName());
//console.log(testList.getProjects());

// console.log(testTask.getFormattedDate());
// console.log(test.getTasks());
// console.log(testTask.getName());
// console.log(test.getName());

// console.log(test.getTasks());