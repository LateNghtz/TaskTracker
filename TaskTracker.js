const fs = require('fs');
const path = require('path');

const filePath = 'Data/Data.json';

// Initial empty data structure
const data = {
  currentId: 0,
  tasks: []
};

// Function to initialize the data file and folder
function init() {
  fs.mkdir('Data', { recursive: true }, (err) => {
    if (err) {
      console.error('Error creating Data directory:', err);
    } else {
      console.log('📁 Data directory created successfully.');
    }

    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFile(filePath, jsonData, (err) => {
      if (err) {
        console.error('❌ Error writing to file:', err);
      } else {
        console.log('✅ Data file initialized successfully!');
      }
    });
  });
}

// Load tasks from file
function loadTasks() {
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf8');
    const parsedData = JSON.parse(data);
    return parsedData;
  } else {
    return { currentId: 0, tasks: [] };
  }
}

// Save tasks to file
function saveTasks(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// Get the lowest unused ID
function getLowestUnusedId(tasks) {
  const usedIds = new Set(tasks.map(task => task.id));
  let id = 0;
  while (usedIds.has(id)) {
    id++;
  }
  return id;
}

// Add a new task
function addTask(title) {
  const data = loadTasks();
  const newId = getLowestUnusedId(data.tasks);
  const task = { id: newId, title, completed: false };

  data.tasks.push(task);
  data.currentId = newId; // optional tracking

  saveTasks(data);
  console.log(`✅ Task added: "${task.title}" (ID: ${task.id})`);
}

// Delete a task by ID
function deleteTaskById(id) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('❌ Error reading the file:', err);
      return;
    }

    let jsonData;
    try {
      jsonData = JSON.parse(data);
    } catch (e) {
      console.error('❌ Error parsing JSON:', e);
      return;
    }

    const originalLength = jsonData.tasks.length;
    jsonData.tasks = jsonData.tasks.filter(task => task.id !== Number(id));

    if (jsonData.tasks.length < originalLength) {
      fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
        if (err) {
          console.error('❌ Error writing the file:', err);
        } else {
          console.log(`🗑️ Task with ID ${id} deleted successfully!`);
        }
      });
    } else {
      console.log('⚠️ Task with the specified ID not found.');
    }
  });
}

// List all tasks
function listAllTasks() {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('❌ Error reading the file:', err);
      return;
    }

    let jsonData;
    try {
      jsonData = JSON.parse(data);
    } catch (e) {
      console.error('❌ Error parsing JSON:', e);
      return;
    }

    if (jsonData.tasks.length === 0) {
      console.log('📭 No tasks found.');
    } else {
      console.log('\n📋 All Tasks:\n');
      jsonData.tasks.forEach(task => {
        const line = `ID: ${task.id} | Title: ${task.title} | Completed: ${task.completed}`;
        console.log(line);
        console.log('-'.repeat(line.length));
      });
    }
  });
}

// Command line interface
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'init':
    init();
    break;

  case 'add':
    if (args[1]) {
      addTask(args.slice(1).join(' ')); // allow multi-word titles
    } else {
      console.log('⚠️ Please provide a task title.');
    }
    break;

  case 'delete':
    if (args[1]) {
      deleteTaskById(args[1]);
    } else {
      console.log('⚠️ Please provide a task ID to delete.');
    }
    break;

  case 'list':
    listAllTasks();
    break;

  default:
    console.log('❓ Unknown command. Use one of: init, add, delete, list');
}
