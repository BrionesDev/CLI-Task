# 🚀 CLI Task Manager

A simple and interactive terminal-based task manager. Easily add, update, delete, and list your tasks from the command line!

---

## ✨ Features

- ➕ **Add tasks** with descriptions
- ✏️ **Update** existing tasks
- 🗑️ **Delete** tasks
- ✅ **Mark** tasks as `todo`, `in-progress`, or `done`
- 📋 **List** all tasks or filter by status
- 💾 **Data is saved locally** in a JSON file for persistence

---

## ⚡ Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/BrionesDev/CLI-Task.git
   cd cli-task
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

---

## 🛠️ Usage

Start the program with:

```sh
npm start
```

Follow the on-screen instructions to manage your tasks.

---

## 💡 Example Commands

- **Add a new task:**
  ```
  add "Buy groceries"
  ```

- **Update a task description:**
  ```
  update <task_id> "Buy groceries and cook dinner"
  ```

- **Delete a task:**
  ```
  delete <task_id>
  ```

- **Mark a task as done:**
  ```
  mark-done <task_id>
  ```

- **List all tasks:**
  ```
  list
  ```

- **List tasks by status:**
  ```
  list done
  list todo
  list in-progress
  ```

---

## 📦 Requirements

- Node.js 18 or higher

---

## 👤 Author

BrionesDev
