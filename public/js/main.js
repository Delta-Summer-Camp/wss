const userValidation = (initObject) => {
    if (initObject.username === currentUser.username) {
        currentUser.isHunter = initObject.isHunter;
    }
}



const pauseMenu = document.getElementById('pause-menu');

document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        toggleMenu();
    }
});

const toggleMenu = () => {
    pauseMenu.classList.toggle('hidden');
}