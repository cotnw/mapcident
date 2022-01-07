let currentPage = 1;

function render() {
    const p1 = document.getElementById('p1');
    const p2 = document.getElementById('p2');
    const p3 = document.getElementById('p3');

    p1.style.display = 'none';
    p2.style.display = 'none';
    p3.style.display = 'none';

    document.getElementById('step-number').innerHTML = currentPage;
    if (currentPage === 1) {
        p1.style.display = "block";
        p2.style.display = "none";
        p3.style.display = "none";
    } else if (currentPage === 2) {
        p1.style.display = "none";
        p2.style.display = "block";
        p3.style.display = "none";
    } else if (currentPage === 3) {
        p1.style.display = "none";
        p2.style.display = "none";
        p3.style.display = "block";
    }
}

window.addEventListener('click', (e) => {
    if (e.target.classList.contains('continue')) {
        if (currentPage === 3) {
            window.location.href = '/dashboard';
        } else {
            currentPage++;
            render();
        }
    }
})

window.onload = () => {
    if (window.screen.width > 500) {
        window.location.href= '/phone'
    } else {
        document.getElementsByTagName('body')[0].style.display = 'block'
    }
    render();
}