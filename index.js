'use strict';
import readline from 'readline';

const rl = readline.createInterface({input: process.stdin, output: process.stdout});

const mainMenu = () => {
    rl.question(`\n= = = = = CLI TASK MANAGER = = = = =
    What would you like to do?
    1. Add a task
    2. Update a task
    3. Remove a task
    4. List all tasks
    5. List completed tasks
    6. List uncompleted tasks
    7. List WIP tasks
    8. Exit`,
    (answer) => {
        if (!options[answer]) {
            console.log(`Invalid option. Please try again.`);
            return mainMenu();
        }
        options[answer]();
    });
};

const addTask = (task) => {
};

const updateTask = (task) => {
};

const removeTask = (taskId) => {
};

const listAllTasks = () => {
};

const listCompletedTasks = () => {
};

const listUncompletedTasks = () => {
};

const listWipTasks = () => {
};

const options = {
    '1': addTask,
    '2': updateTask,
    '3': removeTask,
    '4': listAllTasks,
    '5': listCompletedTasks,
    '6': listUncompletedTasks,
    '7': listWipTasks,
    '8': () => {
        console.log("Exiting...");
        rl.close();
        process.exit(0);
    }
};

mainMenu();
