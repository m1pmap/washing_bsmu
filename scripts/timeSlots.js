const MAX_PLACES = 8;

const timeSlots = [
    { time: '13:00 – 14:00', booked: 2, isMine: false },
    { time: '14:00 – 15:00', booked: 5, isMine: false },
    { time: '15:00 – 16:00', booked: 8, isMine: false },
    { time: '16:00 – 17:00', booked: 0, isMine: false },
    { time: '17:00 – 18:00', booked: 0, isMine: false },
    { time: '18:00 – 19:00', booked: 8, isMine: false },
    { time: '19:00 – 20:00', booked: 0, isMine: false },
    { time: '20:00 – 21:00', booked: 0, isMine: false }
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
            selectedIndex = index;
            renderSlots();
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
            slot.booked--;
            slot.isMine = false;
        }
    });
}