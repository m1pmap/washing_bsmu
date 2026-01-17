// Счетчик
let counter = localStorage.getItem('counter') || 0;
document.getElementById('counter').textContent = counter;

function increment() {
    counter++;
    document.getElementById('counter').textContent = counter;
    localStorage.setItem('counter', counter);
}

function reset() {
    counter = 0;
    document.getElementById('counter').textContent = counter;
    localStorage.setItem('counter', counter);
}

// Заметки
let notes = JSON.parse(localStorage.getItem('notes')) || [];

function renderNotes() {
    const notesContainer = document.getElementById('notes');
    notesContainer.innerHTML = '';
    
    notes.forEach((note, index) => {
        const noteElement = document.createElement('div');
        noteElement.className = 'note';
        noteElement.innerHTML = `
            <span>${note}</span>
            <button class="delete-btn" onclick="deleteNote(${index})">Удалить</button>
        `;
        notesContainer.appendChild(noteElement);
    });
}

function addNote() {
    const input = document.getElementById('newNote');
    const text = input.value.trim();
    
    if (text) {
        notes.push(text);
        localStorage.setItem('notes', JSON.stringify(notes));
        renderNotes();
        input.value = '';
    }
}

function deleteNote(index) {
    notes.splice(index, 1);
    localStorage.setItem('notes', JSON.stringify(notes));
    renderNotes();
}

// Инициализация
renderNotes();

// Пример работы с Google Drive (опционально)
async function loadFromDrive() {
    try {
        // Тут будет код для загрузки данных с Google Drive
        console.log('Загружаем данные...');
    } catch (error) {
        console.error('Ошибка загрузки:', error);
    }
}