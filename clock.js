// ===== Welcome Screen Live Clock =====
function updateWelcomeClock() {
    const clockEl = document.getElementById('clockText');
    if (!clockEl) return;

    const now = new Date();

    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        numberingSystem: 'latn' // يخلي الأرقام انجليزية
    };

    clockEl.textContent = now.toLocaleDateString('ar-IQ', options);
}

setInterval(updateWelcomeClock, 1000);
updateWelcomeClock();