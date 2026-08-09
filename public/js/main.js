const userValidation = (initObject) => {
    if (initObject.username === currentUser.username) {
        currentUser.isHunter = initObject.isHunter;
    }
}