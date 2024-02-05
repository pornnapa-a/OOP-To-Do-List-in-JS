window.onload = () => {
    tasks.forEach(item => item.state = "show");
    Task.display();
}

let tasks = [];
const getTasks = localStorage.getItem('tasks');

if (getTasks) tasks = JSON.parse(getTasks);

const input = document.getElementById('task'),
    createBtn = document.getElementById('create-task'),
    search_btn = document.getElementById('search-task'),
    refresh = document.getElementById('refresh'),
    clear__all = document.querySelector('.clear__all');

class Task {
    // display tasks
    static display() {
        const tasks_container = document.getElementById('tasks');
        let _tasks = '';
        tasks.forEach((task, index) => {
            _tasks += `                                         
                <div class="task-item ${task.state === "show" ? 'mt-2 d-flex justify-content-between align-items-center' : 'd-none'}">
                    <div class="task-name">
                        <p class="${task.completed === 'true' ? 'text-decoration-line-through' : 'text-dark'}" id="task__name">${task.name}</p>
                    </div>
                    <div class="action btns">
                        <button type="button" class="btn btn-sm btn-success is__completed" onclick="Task.todoCompleted('${task.id}')"><i class="fa-solid fa-circle-check"></i></button>
                        <button type="button" class="btn btn-sm btn-primary edit" onclick="Task.update('${task.id}')"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button type="button" class="btn btn-sm btn-danger ms-1 delete" onclick="Task.delete('${task.id}')"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                </div>
            `;
        });
        (tasks.length === 0 || _tasks === '') ? clear__all.classList.add('d-none') : clear__all.classList.remove('d-none');
        tasks_container.innerHTML = _tasks;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // create task
    static create(task) {
        const generateRandomId = Math.floor(Math.random() * 99999);
        tasks.push({ id: generateRandomId, name: task, completed: 'false', state: 'show' });
        this.display();
    }

    // completed
    static todoCompleted(task) {
        tasks.forEach(item => {
            if (`${item.id}` === task) {
                if (item.completed === 'false')
                    item.completed = 'true';
                else
                    item.completed = 'false';
            }
        });

        this.display();
    }

    // update/edit task
    static update(task) {
        const taskItems = document.querySelectorAll('.task-item');
        const taskInput = document.getElementById('task-input');
        const edit = document.querySelectorAll('.task-name');

        tasks.forEach((item, index) => {
            if (`${item.id}` === task) {
                taskItems[index].classList.add('task-editing');
                edit[index].innerHTML = `
                    <input type="text" id="task-input" class="form-control" value="${item.name}" placeholder="Edit this Todo and Hit Enter!" title="Edit this Todo and Hit Enter!" />
                    <button type="button" class="btn btn-primary save-edited-todo">Edit This</button>
                `;

                const taskInputs = document.querySelectorAll('#task-input');
                const saveEditTodo = document.querySelector('.save-edited-todo');
                if (taskInputs) {
                    taskInputs.forEach(input => {
                        input.addEventListener('keydown', e => {
                            if (e.key === 'Enter') {
                                if (input.value === '') showError('.error', 'Edit Field Cannot be Empty!');

                                saveEditTodo.addEventListener('click', e => {
                                    let input_value = input.value;
                                    if (input_value) this.update(task, input_value);
                                });

                                saveEditTodo.click();
                            }
                        });
                    });
                }

                if (taskInput.value === '') return;

                item.name = taskInput.value;
            }
        });

        this.display();
    }

    // delete task
    static delete(task) {
        tasks = tasks.filter(item => `${item.id}` !== task);

        // tasks.forEach((item, index) => {
        //     if(`${item.id}` === task) {
        //         tasks.splice(index, 1)
        //     }
        // });
        this.display();
    }

    // search task
    static search(task) {
        tasks = tasks.filter(item => item.name.toLowerCase() === task ? item.state = "show" : item.state = "hide");

        const checkTask = element => element.name.toLowerCase() === `${task.toString()}`;
        if (tasks.some(checkTask) === false) {
            showError('.error', 'Todo, Does not Exists!');
            return clear__all.classList.add('d-none');
        } else clear__all.classList.remove('d-none');

        this.display();
    }
}

// Create Btn
createBtn.addEventListener('click', (e) => {
    const input_value = input.value;
    if (input_value !== '') {
        input.value = '';
        Task.create(input_value);
    } else {
        showError('.error', 'Cannot Add Todo!');
    }
});

// Search Btn
search_btn.addEventListener('click', e => {
    let task = input;
    let search_value = input.value;

    if (search_value != '') {
        task.style.border = '1px solid gray';
        input.value = '';
        Task.search(search_value.toLowerCase());
    } else {
        showError('.error', 'Search Field Cannot be Empty!');
        task.style.border = '1px solid red';
    }
});

// Prevent from Submit-ing the Form
let form = document.querySelector('.form');
form.addEventListener('submit', e => {
    e.preventDefault();
});

// Keyboard Support Enter Key (To add a Task) and > Right Arrow (to Search)
input.addEventListener('keydown', e => {
    if (e.key === 'Enter') createBtn.click();

    if (e.key === 'ArrowRight') search_btn.click();
});

// Errors Function
function showError(error_place, error_message) {
    const error_container = document.querySelector(error_place);
    if (error_container) {
        error_container.innerHTML = `
            <div class="alert alert-danger error" role="alert">
                ${error_message}
            </div>
        `;
        setTimeout(() => error_container.innerHTML = '', 3000);
    }
}

// Clear All Btn
function clearAll() {
    tasks = [];
    Task.display();
}

clear__all.addEventListener('click', clearAll);

// Refresh Page
refresh.addEventListener('click', () => location.href = location.href);

const daysContainer = document.querySelector(".days");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");
const todayBtn = document.querySelector(".today");
const month = document.querySelector(".month");

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const date = new Date();
let currentMonth = date.getMonth();
let currentYear = date.getFullYear();

const renderCalendar = () => {
  date.setDate(1);
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const lastDayIndex = lastDay.getDay();
  const lastDayDate = lastDay.getDate();
  const prevLastDay = new Date(currentYear, currentMonth, 0);
  const prevLastDayDate = prevLastDay.getDate();
  const nextDays = 7 - lastDayIndex - 1;

  month.innerHTML = `${months[currentMonth]} ${currentYear}`;

  let days = "";

  for (let x = firstDay.getDay(); x > 0; x--) {
    days += `<div class="day prev">${prevLastDayDate - x + 1}</div>`;
  }

  for (let i = 1; i <= lastDayDate; i++) {
    if (
      i === new Date().getDate() &&
      currentMonth === new Date().getMonth() &&
      currentYear === new Date().getFullYear()
    ) {
      days += `<div class="day today">${i}</div>`;
    } else {
      days += `<div class="day">${i}</div>`;
    }
  }

  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next">${j}</div>`;
  }

  daysContainer.innerHTML = days;
  hideTodayBtn();
};

nextBtn.addEventListener("click", () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar();
});

prevBtn.addEventListener("click", () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar();
});

todayBtn.addEventListener("click", () => {
  currentMonth = date.getMonth();
  currentYear = date.getFullYear();
  renderCalendar();
});

function hideTodayBtn() {
  if (
    currentMonth === new Date().getMonth() &&
    currentYear === new Date().getFullYear()
  ) {
    todayBtn.style.display = "none";
  } else {
    todayBtn.style.display = "flex";
  }
}

renderCalendar();




//Note
function renderNotes() {
    noteList.innerHTML = "";
    savedNotes.forEach(function(noteText, index) {
        const noteItem = document.createElement("li");
        noteItem.classList.add("note-item"); // เพิ่มคลาส note-item

        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>'; // Add Font Awesome trash icon
        deleteButton.classList.add("btn", "btn-danger", "btn-sm"); // Add Bootstrap button classes
        deleteButton.setAttribute("title", "Delete"); // Add title attribute

        deleteButton.addEventListener("click", function() {
            savedNotes.splice(index, 1);
            localStorage.setItem("notes", JSON.stringify(savedNotes));
            renderNotes();
        });

        const editButton = document.createElement("button");
        editButton.textContent = "แก้ไข";
        editButton.classList.add("btn", "btn-secondary", "btn-sm"); // Add Bootstrap button classes

        editButton.addEventListener("click", function() {
            const newText = prompt("แก้ไขบันทึก", noteText);
            if (newText !== null && newText !== "") {
                savedNotes[index] = newText;
                localStorage.setItem("notes", JSON.stringify(savedNotes));
                renderNotes();
            }
        });

        const buttonsContainer = document.createElement("div");
        buttonsContainer.classList.add("buttons-container"); // เพิ่มคลาส buttons-container
        buttonsContainer.appendChild(deleteButton);
        buttonsContainer.appendChild(editButton);

        noteItem.textContent = noteText;
        noteItem.appendChild(buttonsContainer);
        noteList.appendChild(noteItem);
    });
}
