const fs = require('fs');

// Define the path for the JSON file
const filePath = 'Data/Data.json';

// Function to load tasks and currentId from the JSON file
function loadTasks() {
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf8');
    const parsedData = JSON.parse(data);
    return parsedData;
  } else {
    return { currentId: 0, tasks: [] };
  }
}

// Function to save tasks and currentId to the JSON file
function saveTasks(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// Initialize tasks and currentId by loading from the file
let { currentId, tasks } = loadTasks();

// Function to add a task
function addTask(title) {
  const task = { id: currentId++, title, completed: false };
  tasks.push(task);

  // Save updated tasks and currentId back to the JSON file
  saveTasks({ currentId, tasks });

  console.log(`Task added: ${task.title}`);
}

// Access command line arguments
const args = process.argv.slice(2);  // Remove the first two elements (node and script path)
const command = args[0]; // First argument is the command for exampe "add"


switch (command) {
    case 'add':
        if (args[1]) {
            addTask(args[1]);
        } else {
            console.log('Please provide a task title.');
        }
        break;
} 