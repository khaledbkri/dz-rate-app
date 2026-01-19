const currencies = [
    { code: 'EUR', name: 'Euro', flag: '🇪🇺', bank: 145.20, square: 242.00 },
    { code: 'USD', name: 'US Dollar', flag: '🇺🇸', bank: 134.50, square: 224.00 }
];

function updateClock() {
    const now = new Date();
    document.getElementById('clock').textContent = now.toLocaleTimeString();
    document.getElementById('date').textContent = now.toLocaleDateString('ar-DZ', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
}
setInterval(updateClock, 1000);
updateClock();

function displayRates() {
    const container = document.getElementById('rates-container');
    let html = '';
    currencies.forEach(curr => {
        html += `
            <div class="rate-card">
                <div style="display:flex; justify-content:space-between;">
                    <span>${curr.flag} ${curr.name}</span>
                    <span style="color:#4caf50;">▲ مباشر</span>
                </div>
                <div style="display:flex; justify-content:space-around; margin-top:10px;">
                    <div><small>البنك</small><br>${curr.bank}</div>
                    <div style="color:#4caf50; font-weight:bold;"><small>السكوار</small><br>${curr.square}</div>
                </div>
            </div>`;
    });
    container.innerHTML = html;
}

function initCalc() {
    const from = document.getElementById('from-currency');
    const to = document.getElementById('to-currency');
    const input = document.getElementById('calc-input');
    const res = document.getElementById('calc-result');

    const options = `<option value="DZD">DZD - دينار</option><option value="EUR">EUR - يورو</option><option value="USD">USD - دولار</option>`;
    from.innerHTML = options; to.innerHTML = options;
    to.value = "DZD";

    input.oninput = () => {
        let val = input.value;
        if(from.value === "EUR" && to.value === "DZD") res.innerText = (val * 242).toLocaleString();
        else if(from.value === "USD" && to.value === "DZD") res.innerText = (val * 224).toLocaleString();
        else res.innerText = val;
    };
}

displayRates();
initCalc();
