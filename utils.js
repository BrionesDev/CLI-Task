import readline from "readline";
import { handleUserInput } from "./taskService.js";

const rl = readline.createInterface({input: process.stdin, output: process.stdout});

export const mainMenu = () => rl.question(`
= = = = = = = = = = = = = = = CLI TASK MANAGER = = = = = = = = = = = = = = =
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
exit
`, handleUserInput);

export const removeQuotes = text => text.replace(/["']/g, "").trim();

export const hasQuotes = args => {
    const text = args.join(" ").trim();
    const singleQuotePattern = /^'[^']*'$/;
    const doubleQuotePattern = /^"[^"]*"$/;
    if (!singleQuotePattern.test(text) && !doubleQuotePattern.test(text)) {
        console.error("\nInvalid input. Please use single or double quotes for the task value.");
        return false;
    }
    return true;
};

export const hasArgs = args => {
    if (!args.length) {
        console.error("\nInvalid input. Argument is required.");
        return false;
    }
    return true;
};

export const hasValue = text => {
    if (!removeQuotes(text)) {
        console.error("\nInvalid input. Task value cannot be empty.");
        return false;
    }
    return true;
};