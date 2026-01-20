document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.getElementById('carousel');
    const track = document.getElementById('dateTrack');

    const MAX_FUTURE_DAYS = 13;
    const DISPLAY_DAYS = 18;
    const START_OFFSET = -2;

    const daysRu = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let items = [];

    function isDisabled(offset) {
        return offset < 0 || offset > MAX_FUTURE_DAYS;
    }

    let ignoreScroll = false;

    function setActive(item) {
        if (item.classList.contains('disabled')) return;

        items.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        ignoreScroll = true; // отключаем обработку scroll
        item.scrollIntoView({
            behavior: 'smooth',
            inline: 'center',
            block: 'nearest'
        });

        // через короткую паузу снова разрешаем scroll
        setTimeout(() => {
            ignoreScroll = false;
        }, 200); // 200 мс должно хватить для плавного скролла
    }

    // генерация дней
    for (let i = 0; i < DISPLAY_DAYS; i++) {
        const offset = START_OFFSET + i;
        const date = new Date(today);
        date.setDate(today.getDate() + offset);

        const disabled = isDisabled(offset);

        const item = document.createElement('div');
        item.className = 'date-item';
        item.dataset.offset = offset;

        if (disabled) item.classList.add('disabled');

        item.innerHTML = `
            <div class="statusDot"></div>
            <span class="num">${String(date.getDate()).padStart(2, '0')}</span>
            <span class="day">${daysRu[date.getDay()]}</span>
            <div class="dot"></div>
        `;

        item.addEventListener('click', () => setActive(item));

        track.appendChild(item);
        items.push(item);

        // сегодня активен по умолчанию
        if (offset === 0) {
            item.classList.add('active');
            setTimeout(() => setActive(item), 100);
        }
    }

    // свайп → выбираем ближайший допустимый
    carousel.addEventListener('scroll', () => {
        if (ignoreScroll) return; // игнорируем если скролл вызван кликом

        const center = carousel.scrollLeft + carousel.offsetWidth / 2;

        let closest = null;
        let minDistance = Infinity;

        items.forEach(item => {
            if (item.classList.contains('disabled')) return;

            const itemCenter = item.offsetLeft + item.offsetWidth / 2;
            const dist = Math.abs(center - itemCenter);

            if (dist < minDistance) {
                minDistance = dist;
                closest = item;
            }
        });

        if (closest) {
            items.forEach(i => i.classList.remove('active'));
            closest.classList.add('active');
        }
    });
});
