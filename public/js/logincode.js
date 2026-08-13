let isPlaying = false;

const registration = document.getElementById('registration');
const login = document.getElementById('login');
const playScreen = document.getElementById('start-screen');
login.classList.remove('hidden');
registration.classList.add('hidden');
playScreen.classList.add('hidden');

function validateLogin() {
    $.post("login.php",
        {
            username: $("#login-username").val(),
            passwordHash: md5($("#login-password").val())
        },
        function (data, status) {
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