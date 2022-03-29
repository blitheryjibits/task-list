//import taskFactory from './task';
import projectFactory from './projects'

const list = () => {

    let projects = [];

    const getProjects = () => { return projects; }
    const getProject = (projectName) => { return projects.find((project) => project.getName() === projectName); }
    const setProject = (project) => { projects.push(project); }

    const deleteProject = (projectName) => { 
        let tempArray = projects.filter((project) => project.getName !== projectName);
        projects = tempArray;
     }
    
    return { getProject, getProjects, setProject, deleteProject };
}

export default { list };