// Function to take the "initObject" from our database and assign the user the predefined isHunter

const userValidation = (initObject) => {
    if (initObject.username === currentUser.username) {
        currentUser.isHunter = initObject.isHunter;
    }
}

// DOM MANIPULATION

//Definitions

const pauseMenu = document.getElementById('pause-menu');
const settings = document.getElementById('settings');
const colorInput = document.getElementById('color-input');
const option = document.getElementById('options');
let colorInputValue;

// Pause Menu Reveal

document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        toggleMenu();
    }
});

function toggleMenu() {
    pauseMenu.classList.toggle('hidden');

}

function toggleSettings() {
    toggleMenu();
    settings.classList.toggle('hidden');
}

const setBgColor = () => {

    BgColor = parseInt(colorInput.value.replace('#', ''), 16);
    game.setBackgroundColor(BgColor);
}

colorInput.addEventListener('input', function (event) {
    
    colorInputValue = event.target.value; 
})

colorInput.addEventListener('keydown', function (event) { 
    if (event.key === "Enter") {
       setBgColor(); 
       toggleSettings();
    }
})