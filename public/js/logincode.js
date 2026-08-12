let isPlaying = false;

const registration = document.getElementById('registration');
const login = document.getElementById('login');
const playScreen = document.getElementById('start-screen');
login.classList.remove('hidden');
registration.classList.add('hidden');
playScreen.classList.add('hidden');



function register() {
    login.classList.add('hidden');
    registration.classList.remove('hidden');

}

function startScreen() {
    login.classList.add('hidden');
    registration.classList.add('hidden');
    playScreen.classList.remove('hidden');
}

function startGame() {

    const startScreen = document.getElementById('start-screen');
    login.classList.add('hidden');
    registration.classList.add('hidden');
    startScreen.classList.add('hidden');
    isPlaying = true;

}
// Get Login data from form

const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', function (event) {
    // Prevent the default browser page reload
    event.preventDefault();

    // Pass the form element into FormData
    const formData = new FormData(loginForm);

    // Extract values using the "name" attributes from your HTML
    localStorage.setItem("username", formData.get('username'));
    localStorage.setItem("password", formData.get('password'));
});

// Get Registration data from form
const regForm = document.getElementById('registration-form');

regForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent page reload

    const formData = new FormData(regForm);


    // Extract by HTML 'name' attributes
    const usernameRegister = formData.get('username').trim();
    const passwordRegister = formData.get('password');
    const passwordConfirmRegister = formData.get('password2');
    localStorage.setItem("username", formData.get('username'));
    localStorage.setItem("password", formData.get('password'));


    if (password !== passwordConfirmRegister) {
        alert("Passwords do not match!");
        return;
    }

});