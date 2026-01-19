const currencies = [
    { code: 'EUR', name: {ar:'يورو', en:'Euro', fr:'Euro'}, flag: '🇪🇺', bank: 145.20, square: 242.00 },
    { code: 'USD', name: {ar:'دولار', en:'US Dollar', fr:'Dollar US'}, flag: '🇺🇸', bank: 134.50, square: 224.00 },
    { code: 'SAR', name: {ar:'ريال سعودي', en:'Saudi Riyal', fr:'Riyal Saoudien'}, flag: '🇸🇦', bank: 34.69, square: 46.83 },
    { code: 'GBP', name: {ar:'جنيه إسترليني', en:'British Pound', fr:'Livre Sterling'}, flag: '🇬🇧', bank: 168.10, square: 282.00 },
    { code: 'CAD', name: {ar:'دولار كندي', en:'Canadian Dollar', fr:'Dollar Canadien'}, flag: '🇨🇦', bank: 98.40, square: 162.00 },
    { code: 'SEK', name: {ar:'كرون سويدي', en:'Swedish Krona', fr:'Couronne Suédoise'}, flag: '🇸🇪', bank: 12.50, square: 21.00 }
];

let currentLang = 'ar';

const translations = {
    ar: { title: "محول العملات الذكي", res: "النتيجة", bank: "البنك", square: "السكوار", dzd: "دينار جزائري" },
    en: { title: "Smart Converter", res: "Result", bank: "Bank", square: "Square", dzd: "Algerian Dinar" },
    fr: { title: "Convertisseur", res: "Résultat", bank: "Banque", square: "Square", dzd: "Dinar Algérien" }
};

function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.getElementById('calc-title').innerText = translations[lang].title;
    document.getElementById('res-text').innerText = translations[lang].res;
    displayRates();
    initCalc();
}

function updateClock() {
    const now = new Date();
    document.getElementById('clock').textContent = now.toLocaleTimeString();
    document.getElementById('date').textContent = now.toLocaleDateString(currentLang === 'ar' ? 'ar-DZ' : 'en-GB', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
}
setInterval(updateClock, 1000);

function displayRates() {
    const container = document.getElementById('rates-container');
    let html = '';
    currencies.forEach(curr => {
        html += `
            <div class="rate-card">
                <div style="display:flex; justify-content:space-between;">
                    <span>${curr.flag} ${curr.name[currentLang]} (${curr.code})</span>
                    <span style="color:#4caf50; font-size:0.8rem;">● Live</span>
                </div>
                <div style="display:flex; justify-content:space-between; margin-top:10px;">
                    <div><span style="color:#4caf50; font-size:1.3rem; font-weight:bold;">${curr.square} DA</span><br><small>${translations[currentLang].square}</small></div>
                    <div style="text-align:right;"><span style="font-weight:bold;">${curr.bank} DA</span><br><small>${translations[currentLang].bank}</small></div>
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
    let options = `<option value="DZD">🇩🇿 DZD - ${translations[currentLang].dzd}</option>`;
    currencies.forEach(c => { options += `<option value="${c.code}">${c.flag} ${c.code}</option>`; });
    from.innerHTML = options; to.innerHTML = options; to.value = "DZD";
    input.oninput = () => {
        let val = parseFloat(input.value) || 0;
        let fRate = from.value === "DZD" ? 1 : currencies.find(c => c.code === from.value).square;
        let tRate = to.value === "DZD" ? 1 : currencies.find(c => c.code === to.value).square;
        res.innerText = ((val * fRate) / tRate).toLocaleString() + (to.value === "DZD" ? " DA" : "");
    };
}

updateClock();
displayRates();
initCalc();
