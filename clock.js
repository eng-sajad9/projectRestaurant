// ===== Welcome Screen Live Clock =====
function updateWelcomeClock() {
    const clockEl = document.getElementById("clockText");
    if (!clockEl) return;

    const now = new Date();

    const days = [
        "الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"
    ];

    const months = [
        "يناير","فبراير","مارس","أبريل","مايو","يونيو",
        "يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"
    ];

    let dayName = days[now.getDay()];
    let day = now.getDate();
    let month = months[now.getMonth()];
    let year = now.getFullYear();

    let hours = now.getHours();
    let minutes = String(now.getMinutes()).padStart(2,"0");
    let seconds = String(now.getSeconds()).padStart(2,"0");

    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    clockEl.textContent =
        `${dayName}، ${day} ${month} ${year}، ${hours}:${minutes}:${seconds} ${ampm}`;
}

setInterval(updateWelcomeClock, 1000);
updateWelcomeClock();