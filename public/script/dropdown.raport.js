 document.querySelector('.dropdown-button').addEventListener('click', function () {
    document.querySelector('.dropdown-content').classList.toggle('show');
});

window.addEventListener('click', function (e) {
    if (!e.target.matches('.dropdown-button')) {
        document.querySelector('.dropdown-content').classList.remove('show');
    }
});
