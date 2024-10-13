window.onload = function (e) {
    const button = document.querySelector('button');
    button.onclick = function () {
        window.location.href = '/auth/google/signin';
    };
};
