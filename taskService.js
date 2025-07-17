import fs from "fs";
import { mainMenu, removeQuotes, hasValue, hasArgs, hasQuotes } from "./utils.js";

const TASKS_PATH = "./tasks.json";

const COMMAND_LIST = Object.freeze({
    add: "add",
    update: "update",
    delete: "delete",
    markTodo: "mark-todo",
    markInProgress: "mark-in-progress",
    markDone: "mark-done",
    list: "list",
    listDone: "list done",
    listTodo: "list todo",
    listInProgress: "list in-progress",
    exit: "exit"
});

export const ensureTasksFile = () => {
    if (!fs.existsSync(TASKS_PATH)) fs.writeFileSync(TASKS_PATH, JSON.stringify([]), "utf8");
};

export const readTasks = () => {
    try {
        return JSON.parse(fs.readFileSync(TASKS_PATH, "utf8"));
    } catch {
        return [];
    }
};

export const writeTasks = (tasks, isDelete = false) => {
    fs.writeFileSync(TASKS_PATH, JSON.stringify(tasks, null, 2), "utf8");
    if (!isDelete) {
        console.log("\n- - - - - TASK ADDED / UPDATED - - - - -");
        console.table([tasks.at(-1)]);
    } else {
        console.log("\n- - - - - TASKS DELETED - - - - -\n");
    }
};

export const handleUserInput = (input) => {
    const [command, ...commandArgs] = input.trim().split(" ");

    if ((command === COMMAND_LIST.list || command === COMMAND_LIST.exit) && !commandArgs.length) return actions[command]();

    if ([COMMAND_LIST.listDone, COMMAND_LIST.listTodo, COMMAND_LIST.listInProgress].includes(command + " " + commandArgs)) {
        return actions[command](commandArgs[0]);
    }

    if (command === COMMAND_LIST.add) {
        if (!hasArgs(commandArgs) || !hasQuotes(commandArgs)) return mainMenu();

        return actions[command](...commandArgs);
    }

    if (command === COMMAND_LIST.update) {
        const [taskId, ...description] = commandArgs;

        if (!hasArgs(commandArgs) || !hasQuotes(description)) return mainMenu();

        return actions[command](taskId, ...description);
    }

    if (command === COMMAND_LIST.delete) {
        if (!hasArgs(commandArgs)) return mainMenu();

        return actions[command](commandArgs[0]);
    }

    if ([COMMAND_LIST.markTodo, COMMAND_LIST.markInProgress, COMMAND_LIST.markDone].includes(command)) {
        if (!hasArgs(commandArgs)) return mainMenu();

        return actions[command](command, commandArgs[0]);
    }

    console.error(`\nInvalid command: (${command} ${commandArgs.join(" ")}). Please try again.`);
    mainMenu();
};

export const addTask = (...description) => {
    let tasks = readTasks();
    const fullDescription = description.join(" ");
    if (!hasValue(fullDescription)) return mainMenu();

    const newTask = {
        id: Math.random().toString(36).substring(2, 5),
        description: removeQuotes(fullDescription),
        status: "todo",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    tasks.push(newTask);
    writeTasks(tasks);
    mainMenu();
};

export const updateTask = (taskId, ...args) => {
    const tasks = readTasks();
    const task = findTaskById(tasks, taskId);
    if (!task) return mainMenu();

    const fullDescription = args.join(" ");
    if (!hasValue(fullDescription)) return mainMenu();

    task.description = removeQuotes(fullDescription);
    task.updatedAt = new Date().toISOString();

    writeTasks(tasks);
    mainMenu();
};

export const deleteTask = (taskId) => {
    let tasks = readTasks();
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) {
        console.error(`\nTask with ID ${taskId} not found.`);
        return mainMenu();
    }

    const deletedTask = tasks[taskIndex];
    tasks.splice(taskIndex, 1);

    writeTasks(tasks, true);
    console.table([deletedTask]);
    mainMenu();
};

export const handleMark = (command, taskId) => {
    const tasks = readTasks();
    const task = findTaskById(tasks, taskId);
    if (!task) return mainMenu();

    task.status = command.replace("mark-", "");
    task.updatedAt = new Date().toISOString();

    writeTasks(tasks);
    console.log(`\nTask with ID ${taskId} marked as ${task.status}.`);
    mainMenu();
};

export const handleList = (status) => {
    const tasks = readTasks();
    if (!status) {
        console.log("\n= = = = = ALL YOUR TASKS = = = = =");
        tasks.forEach(task => console.table([task]));
        return mainMenu();
    }

    const filteredTasks = tasks.filter(task => task.status === status);
    if (!filteredTasks.length) {
        console.warn(`\n= = = = = NO ${status.toUpperCase()} TASKS FOUND! = = = = =\n`);
        return mainMenu();
    }
    console.log(`\n= = = = = ALL YOUR ${status.toUpperCase()} TASKS = = = = =`);
    filteredTasks.forEach(task => console.table([task]));
    mainMenu();
};

export const exit = () => {
    console.log("\nExiting...");
    process.exit(0);
};

export const findTaskById = (tasks, taskId) => {
    const task = tasks.find(task => task.id === taskId);
    if (!task) {
        console.error(`\nTask with ID ${taskId} not found.`);
        return null;
    }
    return task;
};

const actions = {
    "add": addTask,
    "update": updateTask,
    "delete": deleteTask,
    "mark-todo": handleMark,
    "mark-in-progress": handleMark,
    "mark-done": handleMark,
    "list": handleList,
    "list done": handleList,
    "list todo": handleList,
    "list in-progress": handleList,
    "exit": exit
};