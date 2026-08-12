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
        activateMenu();
    } else if (event.key === 'Escape') {
        deactivateSettings();
    }
});

function activateMenu() {
    if (allowMovment) {
        pauseMenu.classList.toggle('hidden');
        if (!(pauseMenu.classList.contains('hidden'))) {
            allowMovment = false;
        }
    }


}
function deactivateMenu() {
    pauseMenu.classList.add('hidden');
    allowMovment =true;

}

function activateSettings() {
    deactivateMenu();
    settingsActive = true;
    allowMovment = false;
    console.log(settingsActive);
    settings.classList.toggle('hidden');
}
function deactivateSettings() {
    settingsActive = false;
    console.log(settingsActive);
    settings.classList.add('hidden');
    allowMovment = true;
}

const setBgColor = () => {
    BgColor = parseInt(colorInput.value.replace('#', ''), 16);
    game.setBackgroundColor(BgColor);
    localStorage.setItem("BgColor", BgColor);
}

colorInput.addEventListener('input', function (event) {
    colorInputValue = event.target.value;
})

colorInput.addEventListener('keydown', function (event) {
    if (event.key === "Enter") {
        setBgColor();
        deactivateSettings();
    }
});
function applyColor() {
    setBgColor();
    deactivateSettings();
}

// Store the pending wall type choice before applying
let selectedWallType = wallType; 

// Initialize Wall Picker Click Listeners
document.querySelectorAll('.wall-option').forEach(option => {
    option.addEventListener('click', function () {
        // Remove active class from all options
        document.querySelectorAll('.wall-option').forEach(el => el.classList.remove('selected'));
        
        // Highlight chosen option
        this.classList.add('selected');
        
        // Update temporary variable
        selectedWallType = parseInt(this.getAttribute('data-wall-type'), 10);
    });
});

// Replace your old applyColor function with a combined applySettings function
function applySettings() {
    // 1. Update background color if typed
    if (colorInput.value.trim() !== '') {
        setBgColor();
    }
    
    // 2. Update active game wallType
    wallType = selectedWallType;
    localStorage.setItem("wallType", selectedWallType);

    // 3. Close settings window
    deactivateSettings();
}

function getLocalSetting() {
    if (localStorage.getItem("BgColor") !== undefined){
        BgColor = localStorage.getItem("BgColor");
    }
    if (localStorage.getItem("wallType") !== undefined){
        selectedWallType = Number(localStorage.getItem("wallType"));
    } 
    applySettings();
}
getLocalSetting();