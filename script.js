const currencies = [
    { code: 'EUR', name: 'Euro', flag: '🇪🇺', bank: 145.20, square: 242.00 },
    { code: 'USD', name: 'US Dollar', flag: '🇺🇸', bank: 134.50, square: 224.00 },
    { code: 'SAR', name: 'Saudi Riyal', flag: '🇸🇦', bank: 34.69, square: 46.83 },
    { code: 'GBP', name: 'British Pound', flag: '🇬🇧', bank: 168.10, square: 282.00 },
    { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦', bank: 98.40, square: 162.00 },
    { code: 'SEK', name: 'Swedish Krona', flag: '🇸🇪', bank: 12.50, square: 21.00 }
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
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span>${curr.flag} ${curr.name} (${curr.code})</span>
                    <span style="color:#4caf50; font-size:0.8rem;">● Parallel Market</span>
                </div>
                <div style="display:flex; justify-content:space-between; margin-top:10px;">
                    <div><span style="color:#4caf50; font-size:1.3rem; font-weight:bold;">${curr.square.toFixed(2)} DA</span><br><small>Parallel</small></div>
                    <div style="text-align:right;"><span style="font-weight:bold;">${curr.bank.toFixed(2)} DA</span><br><small>Bank Rate</small></div>
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
    let options = `<option value="DZD">🇩🇿 DZD - دينار</option>`;
    currencies.forEach(c => { options += `<option value="${c.code}">${c.flag} ${c.code}</option>`; });
    from.innerHTML = options; to.innerHTML = options; to.value = "DZD";
    input.oninput = () => {
        let val = parseFloat(input.value) || 0;
        let fRate = from.value === "DZD" ? 1 : currencies.find(c => c.code === from.value).square;
        let tRate = to.value === "DZD" ? 1 : currencies.find(c => c.code === to.value).square;
        res.innerText = ((val * fRate) / tRate).toLocaleString() + (to.value === "DZD" ? " DA" : "");
    };
}
displayRates();
initCalc();
