document.addEventListener('DOMContentLoaded', () => {
    Telegram.WebApp.ready();

    const user = Telegram.WebApp.initDataUnsafe?.user;
    const avatarImg = document.getElementById('user-avatar');

    if (user?.photo_url) {
        avatarImg.src = user.photo_url;
    } else {
        avatarImg.src = 'images/default-avatar.png';
    }
});