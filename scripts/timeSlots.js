const MAX_PLACES = 8;

const timeSlots = [
    { time: '13:00 – 14:00', booked: 2, isMine: false, people: ['wedl_666', 'rewardmemes'] },
    { time: '14:00 – 15:00', booked: 7, isMine: false, people: ['sapex','m1pmap','kotegg','Sucker_for_Pain','amospicus', 'evgen_tompson', 'dinamamont'] },
    { time: '15:00 – 16:00', booked: 8, isMine: false, people: ['BreadMur', 'Dodwew', 'websalam', 'chocochaco', 'ilyu4ik', 'spacegalxe', 'G4RIL4', 'xterny'] },
    { time: '16:00 – 17:00', booked: 0, isMine: false, people: [] },
    { time: '17:00 – 18:00', booked: 0, isMine: false, people: [] },
    { time: '18:00 – 19:00', booked: 8, isMine: false, people: ['fetakza', 'wargen_me', 'hterwun', 'PurpleCush', 'oky_ff', 'kostya_7_1', 'vadym_vv', 'rocky9229'] },
    { time: '19:00 – 20:00', booked: 0, isMine: false, people: [] },
    { time: '20:00 – 21:00', booked: 0, isMine: false, people: [] }
];

const container = document.getElementById('slots');
let selectedIndex = null;

function renderSlots() {
    container.innerHTML = '';

    timeSlots.forEach((slot, index) => {
        const available = MAX_PLACES - slot.booked;

        const div = document.createElement('div');
        div.className = 'slot'; // начальное состояние opacity:0, translateY(20px)

        if (available === 0 && !slot.isMine) div.classList.add('full');
        if (index === selectedIndex) div.classList.add('active');

        let actionButton = '';

        if (slot.isMine) {
            actionButton = `<button class="cancel">Отменить</button>`;
        } else if (available > 0) {
            actionButton = `<button>Записаться</button>`;
        }

        div.innerHTML = `
            <div class="slot-indicator"></div>
            <div class="time">${slot.time}</div>
            <div class="places">Занято: ${slot.booked} / ${MAX_PLACES}</div>
        `;

        const indicator = div.querySelector('.slot-indicator');

        if (available > MAX_PLACES / 2) {
            indicator.style.backgroundColor = '#90bfab'; // зелёный
        } else if (available > 0) {
            indicator.style.backgroundColor = '#f0b259'; // жёлтый
        } else {
            indicator.style.backgroundColor = '#cf847a'; // красный
        }

        div.onclick = () => {
            openSheet(index);
        };

        const btn = div.querySelector('button');
        if (btn) {
            btn.onclick = (e) => {
                e.stopPropagation();

                if (slot.isMine) {
                    slot.booked--;
                    slot.isMine = false;
                } else {
                    cancelPreviousBooking();
                    slot.booked++;
                    slot.isMine = true;
                }

                selectedIndex = index;
                renderSlots();
            };
        }

        container.appendChild(div);

        // Анимация появления с задержкой
        setTimeout(() => {
            div.classList.add('show');
        }, index * 100); // каждый следующий слот появляется через 100ms
    });
}

function cancelPreviousBooking() {
    timeSlots.forEach(slot => {
        if (slot.isMine) {
            slot.isMine = false;

            if (slot.booked > 0) {
                slot.booked--;
            }

            // удаляем "Вы" из списка людей
            slot.people = slot.people.filter(name => name !== 'Вы');
        }
    });
}







const overlay = document.getElementById('overlay');
const sheet = document.getElementById('sheet');
const sheetTime = document.getElementById('sheet-time');
const sheetPeople = document.getElementById('sheet-people');
const sheetAction = document.getElementById('sheet-action');

function openSheet(index) {
    const slot = timeSlots[index];
    selectedIndex = index;

    /* ---------- Заголовок ---------- */
    sheetTime.textContent = slot.time;

    /* ---------- Список людей ---------- */
    sheetPeople.innerHTML = '';

    if (slot.people.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'person';
        empty.textContent = 'Пока никто не записался';
        sheetPeople.appendChild(empty);
    } else {
        slot.people.forEach(name => {
            const personDiv = document.createElement('div');
            personDiv.className = 'person'; // весь div пользователя

            // Имя пользователя
            const nameDiv = document.createElement('div');
            nameDiv.className = 'person-name';
            nameDiv.textContent = name;

            // Кнопка перехода
            const btn = document.createElement('button');
            btn.className = 'person-btn';
            btn.onclick = (e) => {
                e.stopPropagation(); // чтобы не закрывать sheet
                openChat(name);
            };

            // Вставляем в один родительский div
            personDiv.appendChild(nameDiv);
            personDiv.appendChild(btn);

            sheetPeople.appendChild(personDiv);
        });
    }

    /* ---------- СБРОС состояния кнопки (ОЧЕНЬ ВАЖНО) ---------- */
    sheetAction.disabled = false;
    sheetAction.classList.remove('confirm', 'cancel', 'disabled');
    sheetAction.style.opacity = ''; // на случай старого inline-стиля

    /* ---------- Текст + цвет кнопки ---------- */
    if (slot.isMine) {
        sheetAction.textContent = 'Отменить запись';
        sheetAction.classList.add('cancel');
    } else {
        sheetAction.textContent = 'Записаться';
        sheetAction.classList.add('confirm');
    }

    /* ---------- Если мест нет ---------- */
    if (!slot.isMine && slot.booked >= MAX_PLACES) {
        sheetAction.disabled = true;
        sheetAction.textContent = 'Отсутствуют места для записи';
        sheetAction.classList.add('disabled');
    }

    /* ---------- Обработчик кнопки ---------- */
    sheetAction.onclick = () => {
        if (slot.isMine) {
            slot.booked--;
            slot.isMine = false;
            slot.people = slot.people.filter(name => name !== 'Вы');

            selectedIndex = null;

            showToast('Запись отменена', 'cancel');
        } else {
            cancelPreviousBooking();

            slot.booked++;
            slot.isMine = true;
            slot.people.push('Вы');

            selectedIndex = index;

            showToast('Запись успешно создана', 'success');
        }

        closeSheet();
        renderSlots();
    };

    /* ---------- Показываем overlay + sheet ---------- */
    overlay.classList.add('show');
    sheet.classList.add('show');
}


function closeSheet() {
    sheet.classList.remove('show');
    overlay.classList.remove('show');
        sheet.classList.remove('show');
}

overlay.onclick = closeSheet;



const toast = document.getElementById('toast');
let toastTimeout;

function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast show ${type}`;

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 1000);
}