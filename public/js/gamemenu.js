// DOM MANIPULATION

//Definitions

const pauseMenu = document.getElementById('pause-menu');
const settings = document.getElementById('settings');
const colorInput = document.getElementById('color-input');
const option = document.getElementById('options');
let colorInputValue;
let settingsActive = false;

// Pause Menu Reveal

document.addEventListener('keydown', function (event) {
    console.log(settingsActive);

    if (event.key === 'Escape' && !(settingsActive)) {
        toggleMenu();
    } else if (event.key === 'Escape') {
        deactivateSettings();
    }
});

function toggleMenu() {
    pauseMenu.classList.toggle('hidden');

}

function activateSettings() {
    toggleMenu();
    settingsActive = true;
    console.log(settingsActive);
    settings.classList.toggle('hidden');
}
function deactivateSettings() {
    settingsActive = false;
    console.log(settingsActive);
    settings.classList.add('hidden');
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
       deactivateSettings();
    }
})