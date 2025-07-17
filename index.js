import { ensureTasksFile } from "./taskService.js";
import { mainMenu } from "./utils.js";

// main
try {
    ensureTasksFile();
    mainMenu();
} catch (err) {
    console.error(err.message);
    process.exit(1);
}
