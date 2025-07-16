"use strict";
import readline from "readline";
import fs, { write } from "fs";
import { log } from "console";

const rl = readline.createInterface({input: process.stdin, output: process.stdout});

const mainMenu = () => {
    rl.question(`\n= = = = = = = = = = = = = = = CLI TASK MANAGER = = = = = = = = = = = = = = =\n
    ------------------------------ Task Options ---------------------------------
    add                 <value>              ===>    Add a task
    update              <task id> <value>    ===>    Update a task
    delete              <task id>            ===>    Delete a task
    mark-todo           <task id>            ===>    Mark a task as todo
    mark-in-progress    <task id>            ===>    Mark a task as in-progress
    mark-done           <task id>            ===>    Mark a task as done
    ------------------------------ List Options ---------------------------------
    list                                     ===>    List all tasks
    list done                                ===>    List done tasks
    list todo                                ===>    List todo tasks
    list in-progress                         ===>    List in-progress tasks
    -----------------------------------------------------------------------------
    exit\n`
    , handleUserInput);
};

const addTask = (...description) => {
    let tasks = readTasks();
    const fullDescription = description.join(" ");
    
    if (!hasTaskValue(fullDescription)) return mainMenu();

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

const updateTask = (taskId, ...args) => {
    let tasks = readTasks();
    const task = findTaskById(tasks, taskId);

    if (!task) return mainMenu();
    
    const fullDescription = args.join(" ");

    if (!hasTaskValue(fullDescription)) return mainMenu();

    task.description = removeQuotes(fullDescription);
    task.updatedAt = new Date().toISOString();

    writeTasks(tasks);
    mainMenu();
};

const deleteTask = (taskId) => {
    let tasks = readTasks();
    const taskIndex = tasks.findIndex(t => t.id === taskId);

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

const markAsTodo = (taskId) => {};

const markAsInProgress = (taskId) => {};

const markAsDone = (taskId) => {};

const listAllTasks = () => {
    try {
        const tasks = readTasks();

        if (!tasks.length) {
            console.warn("\n= = = = = NO TASKS FOUND! = = = = =\n");
            return mainMenu();
        }
        console.log("\n= = = = = ALL YOUR TASKS = = = = =");
        tasks.forEach(task => console.table([task]));
        } catch (err) {
            console.error(err.message);
        }
        return mainMenu();
};

const listDoneTasks = () => {
};

const listToDoTasks = () => {
};

const listInProgressTasks = () => {
};

const exit = () => {
    console.log("Exiting...");
    rl.close();
    process.exit(0);
};

const handleUserInput = (input) => {
    const [command, ...commandArgs] = input.trim().split(" ");

    if (commandArgs.length === 0 && (command === "list" || command === "exit")) return actions[command]();

    if (commandArgs.length === 1 && command === "list") return actions[command + " " + commandArgs]();

    if (command === "delete" || command.includes("mark")) {
        if (!hasArgs(commandArgs)) return mainMenu();

        return actions[command](commandArgs[0]);
    }

    if (command === "add") {
        if (!hasArgs(commandArgs)) return mainMenu();

        if (!hasQuotes(commandArgs)) return mainMenu();

        return actions[command](...commandArgs);
    }

    if (command === "update") {
        const [taskId, ...description] = commandArgs;

        if (!hasArgs(commandArgs)) return mainMenu();

        if (!hasQuotes(description)) return mainMenu();

        return actions[command](taskId, ...description);
    }

    console.error(`Invalid command: (${command}). Please try again.`);
    return mainMenu();
};

const readTasks = () => {
    try {
        return JSON.parse(fs.readFileSync("./tasks.json", "utf8"));
    } catch (error) {
        console.error(error.message);
        return [];
    }
};

const writeTasks = (tasks, isDelete = false) => {
    try {
        fs.writeFileSync("./tasks.json", JSON.stringify(tasks, null, 2), "utf8");
        if (!isDelete) {
            console.log("\n- - - - - TASK ADDED / UPDATED - - - - -");
            console.table([tasks.at(-1)]);
            return;
        }
        console.log("\n- - - - - TASKS DELETED - - - - -\n");
    } catch (error) {
        console.error(error.message);
    }
};

const findTaskById = (tasks, taskId) => {
    const task = tasks.find(task => task.id === taskId);
    if (!task) { 
        console.error(`\nTask with ID ${taskId} not found.`);
        return null;
    }
    return task;
};

const removeQuotes = text => text.replace(/["']/g, "").trim();

const hasQuotes = args => {
    const text = args.join(" ").trim();
    const singleQuotePattern = /^'[^']*'$/;
    const doubleQuotePattern = /^"[^"]*"$/;

    if (!singleQuotePattern.test(text) && !doubleQuotePattern.test(text)) {
        console.error("\nInvalid input. Please use single or double quotes for the task value.");
        return false;
    }
    return true;
};

const hasArgs = args => {
    if (!args.length) {
        console.error("\nInvalid input. Argument is required.");
        return false;
    }
    return true;
};

const hasTaskValue = text => {
    // If user enters '""' or "''", clean it up and check if it's empty
    if (!removeQuotes(text)) {
        console.error("\nInvalid input. Task value cannot be empty.");
        return false;
    }
    return true;
};

const actions = {
    "add": addTask,
    "update": updateTask,
    "delete": deleteTask,
    "mark-todo": markAsTodo,
    "mark-in-progress": markAsInProgress,
    "mark-done": markAsDone,
    "list": listAllTasks,
    "list done": listDoneTasks,
    "list todo": listToDoTasks,
    "list in-progress": listInProgressTasks,
    "exit": exit
};

// main
try {
    if (!fs.existsSync("./tasks.json")) 
        fs.writeFileSync("./tasks.json", JSON.stringify([]), "utf8");
    mainMenu();
} catch (err) {
    console.error(err.message);
    process.exit(1);
}
