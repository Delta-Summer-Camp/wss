localStorage.setItem("passwordHash", 0);
let isPlaying = false;

const registration = document.getElementById('registration');
const login = document.getElementById('login');
const playScreen = document.getElementById('start-screen');
login.classList.remove('hidden');
registration.classList.add('hidden');
playScreen.classList.add('hidden');



function addUser() {
    if ($("#password2").val() !== $("#reg-password").val()) {
        alert("Пароли не совпадают.");
        return;
    }

    $.post("register.php",
        {
            username: $("#reg-username").val(),
            passwordHash: md5($("#reg-password").val())
        },
        function (data, status) {
            localStorage.setItem("username", $("#reg-username").val());
            localStorage.setItem("passwordHash", md5($("#reg-password").val());
            alert("Status: " + status + "; data: " + data['message']);
            if (data['success'] === true) {
                startScreen()
            }
        })
}

function validateLogin() {
    $.post("login.php",
        {
            username: $("#login-username").val(),
            passwordHash: md5($("#login-password").val())
        },
        function (data, status) {
    		localStorage.setItem("username", $("#login-username").val());
            localStorage.setItem("passwordHash", md5($("#login-password").val());
            alert("Status: " + status + "; data: " + data['message']);
            if (data['success'] === true) {
                startScreen()
            }
        })
}

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
