import factoryProject from "./modules/projects";
import taskFactory from "./modules/task";

const test = factoryProject.factoryProject('test');
const testTask = taskFactory.taskFactory('test-task');

// console.log(testTask.getName());
// console.log(test.getName());
// test.setTask('test task number 2');
// console.log(test.getTasks());

testTask.setDueDate(new Date());
test.setTask(testTask);

console.log(testTask.getFormattedDate());
console.log(test.getTasks());

