function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    document.querySelector('.hour').style.transform = `rotate(${(hours % 12) * 30 + minutes * 0.5}deg)`;
    document.querySelector('.minute').style.transform = `rotate(${minutes * 6}deg)`;
    document.querySelector('.second').style.transform = `rotate(${seconds * 6}deg)`;

    document.getElementById('current-date').textContent = now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });

    document.getElementById('current-time').textContent = now.toLocaleTimeString();
}

setInterval(updateClock, 1000);
updateClock();