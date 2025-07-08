const fs = require('fs');
const filePath = 'Data/Data.json';
const data = {
    "currentId": 0,
    "tasks": []
};

function init() {
    fs.mkdir('Data', { recursive: true }, (err) => {
        if (err) {
            console.error('Error creating Data directory:', err);
        } else {
            console.log('Data directory created successfully.');
        }
    });
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFile('Data/data.json', jsonData, (err) => {
        if (err) {
            console.error('Error writing to file', err);
        } else {
            console.log('Data written to file successfully!');
        }
    }); 
}


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

function deleteTaskById(id) {
  // Read the JSON data from the file
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return;
    }

    // Parse the JSON data
    let jsonData;
    try {
      jsonData = JSON.parse(data);
    } catch (e) {
      console.error('Error parsing JSON:', e);
      return;
    }

    // Filter out the task with the specified ID
    const originalLength = jsonData.tasks.length;
    jsonData.tasks = jsonData.tasks.filter(task => task.id !== Number(id));

    // If the task was deleted, update the file
    if (jsonData.tasks.length < originalLength) {
      fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
        if (err) {
          console.error('Error writing the file:', err);
        } else {
          console.log('Task deleted successfully!');
        }
      });
    } else {
      console.log('Task with the specified ID not found.');
    }
  });
}

function listAllTasks() {
  // Read the JSON data
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return;
    }

    // Parse the JSON data
    let jsonData;
    try {
      jsonData = JSON.parse(data);
    } catch (e) {
      console.error('Error parsing JSON:', e);
      return;
    }

    // List all tasks
    if (jsonData.tasks.length === 0) {
      console.log('No tasks found.');
    } else {
      jsonData.tasks.forEach(task => {
        let length = (`ID: ${task.id} | Title: ${task.title} | Completed: ${task.completed}`).length
        console.log(`ID: ${task.id} | Title: ${task.title} | Completed: ${task.completed}`);
        console.log('-'.repeat(length));
      });
    }
  });

}


//Main

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

    case 'init':
        init();
        break;
    
    case 'delete':
        if (args[1]) {
            deleteTaskById(args[1]);
        } else {
            console.log('Please provide a task ID to delete.');
        }
        break;

    case 'list':
        listAllTasks();
        break;
}
