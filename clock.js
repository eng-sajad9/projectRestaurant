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
        hour12: true
    };

    let text = now.toLocaleDateString('ar-IQ', options);

    // تحويل الأرقام العربية الى إنجليزية
    const arabicNumbers = '٠١٢٣٤٥٦٧٨٩';
    text = text.replace(/[٠-٩]/g, d => arabicNumbers.indexOf(d));

    clockEl.textContent = text;
}

setInterval(updateWelcomeClock, 1000);
updateWelcomeClock();