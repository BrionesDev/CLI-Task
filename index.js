"use strict";
import readline from "readline";
import fs from "fs";

const rl = readline.createInterface({input: process.stdin, output: process.stdout});

const mainMenu = () => {
    rl.question(`\n= = = = = = = = = = = = = = = CLI TASK MANAGER = = = = = = = = = = = = = = =\n
    ------------------------------ Task Options ----------------------------
    add                 <value>              ===>  Add a task
    update              <task id> <value>    ===>  Update a task
    delete              <task id>            ===>  Delete a task
    mark todo           <task id>            ===>  Mark a task as todo
    mark in-progress    <task id>            ===>  Mark a task as in-progress
    mark done           <task id>            ===>  Mark a task as done
    ------------------------------ List Options ----------------------------
    list                                     ===>  List all tasks
    list done                                ===>  List done tasks
    list todo                                ===>  List todo tasks
    list in-progress                         ===>  List in-progress tasks
    ------------------------------------------------------------------------
    exit\n`
    , handleUserInput);
};

const addTask = (description) => {
    const newTask = {
        id: Math.random().toString(36).substring(2, 5),
        description,
        status: "todo",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    let tasks = [];
    try {
        const fileContent = fs.readFileSync("./tasks.json", "utf8");
        tasks = JSON.parse(fileContent);
    } catch (error) {
        console.error(error.message);
    }

    tasks.push(newTask);
    fs.writeFileSync("./tasks.json", JSON.stringify(tasks, null, 2), "utf8");

    console.log("- - - - - NEW TASK ADDED - - - - -");
    console.table([newTask]);
    mainMenu();
};

const updateTask = (taskId, description) => {
};

const deleteTask = (taskId) => {
};

const markAsTodo = (taskId) => {};

const markAsInProgress = (taskId) => {};

const markAsDone = (taskId) => {};

const listAllTasks = () => {
    try {
        const tasks = JSON.parse(fs.readFileSync("./tasks.json", "utf8"));

        if (tasks.length === 0) {
            console.warn("\n= = = = = No tasks found! = = = = =\n");
            return mainMenu();
        }
        console.log("\n= = = = = ALL YOUR TASKS = = = = =");
        tasks.forEach(task => console.table(task));
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
    const [command, ...args] = input.trim().split(" ");

    if (args.length === 0 && (command === "list" || command === "exit")) return options[command]();

    if (args.length === 1 && command === "list") return options[command + " " + args]();

    if (command === "add" || command === "delete" || command.startsWith("mark")) return options[command](args[0]);

    if (command === "update") return options[command](args[0], args[1]);

    console.error(`Invalid command: (${command}). Please try again.`);
    return mainMenu();
};

const options = {
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
