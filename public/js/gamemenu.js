// DOM MANIPULATION

//Definitions

const pauseMenu = document.getElementById('pause-menu');
const settings = document.getElementById('settings');
const colorInput = document.getElementById('color-input');
const option = document.getElementById('options');
const phoneToggle = document.getElementById('phoneModeToggle');
let colorInputValue;
let settingsActive = false;

// Settings Variables
let wallType = 0; // 0 to 7 black wall is 0
let BgColor = 0x00FFFF;
let phoneMode = true;

getLocalSetting();


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
function activateMenuButton() {
    phoneMode = false;
    mouseUpdates();
    phoneMode = JSON.parse(localStorage.getItem("phoneMode"));
    activateMenu();
}

function activateSettings() {
    settingsActive = true;
    allowMovment = false;
    settings.classList.toggle('hidden');
    updateWallSelection();
}
function deactivateSettings() {
    settingsActive = false;
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
    }
});
function applyColor() {
    setBgColor();
}

// Initialize Wall Picker Click Listeners
document.querySelectorAll('.wall-option').forEach(option => {
    option.addEventListener('click', function () {
        // Remove active class from all options
        document.querySelectorAll('.wall-option').forEach(el => el.classList.remove('selected'));
        
        // Highlight chosen option
        this.classList.add('selected');
        
        // Update temporary variable
        wallType = parseInt(this.getAttribute('data-wall-type'), 10);
        localStorage.setItem('wallType', wallType);
    });
});

function updateWallSelection() {
    document.querySelectorAll('.wall-option').forEach(option => {
        option.classList.toggle(
            'selected',
            parseInt(option.getAttribute('data-wall-type'), 10) === wallType
        );
    });
}

function getLocalSetting() {
    if (localStorage.getItem("BgColor") === undefined || localStorage.getItem("BgColor") === null){
        localStorage.setItem("BgColor", BgColor);
    }
    if (localStorage.getItem("wallType") === undefined || localStorage.getItem("wallType") === null){
        localStorage.setItem("wallType", wallType);
    }
    if (localStorage.getItem("phoneMode") === undefined || localStorage.getItem("phoneMode") === null){
        localStorage.setItem("phoneMode", phoneMode);
    }
    BgColor = localStorage.getItem("BgColor");
    wallType = Number(localStorage.getItem("wallType"));
    phoneMode = JSON.parse(localStorage.getItem("phoneMode"));
    updatePhoneToggleText();
}

function togglePhoneMode() {
    if (phoneMode == true) {
        phoneMode = false;
    } else {
        phoneMode = true;
    }
    localStorage.setItem("phoneMode", phoneMode);
    updatePhoneToggleText();
}

function updatePhoneToggleText() {
    if (phoneMode) {
        phoneToggle.textContent = "ON";
    } else {
        phoneToggle.textContent = "OFF";
    }
}
