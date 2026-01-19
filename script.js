const apiKey = "fb87de9454864be34e7cbc88";
let ratesData = {};
let currentLang = 'en';

const translations = {
    en: {
        title: "DzRate <span>Live</span>",
        calcTitle: "Currency Converter",
        placeholder: "Enter amount...",
        result: "Result",
        dir: "ltr",
        currencies: { EUR: "Euro", USD: "Dollar", GBP: "Pound", SAR: "Riyal", AED: "Dirham" },
        unit: "DA"
    },
    ar: {
        title: "ديزاد ريت <span>مباشر</span>",
        calcTitle: "محول العملات الذكي",
        placeholder: "أدخل المبلغ...",
        result: "النتيجة",
        dir: "rtl",
        currencies: { EUR: "الأورو", USD: "الدولار", GBP: "الجنيه", SAR: "الريال", AED: "الدرهم" },
        unit: "دج"
    },
    fr: {
        title: "DzRate <span>Direct</span>",
        calcTitle: "Convertisseur",
        placeholder: "Montant...",
        result: "Résultat",
        dir: "ltr",
        currencies: { EUR: "Euro", USD: "Dollar", GBP: "Livre", SAR: "Riyal", AED: "Dirham" },
        unit: "DA"
    }
};

function setLanguage(lang) {
    currentLang = lang;
    const t = translations[lang];
    document.documentElement.lang = lang;
    document.documentElement.dir = t.dir;
    document.getElementById('app-title').innerHTML = t.title;
    document.getElementById('calc-title').innerText = t.calcTitle;
    document.getElementById('calc-input').placeholder = t.placeholder;
    document.getElementById('res-text').innerText = t.result;
    displayRates();
    performConversion();
}

async function getRates() {
    try {
        const res = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`);
        const data = await res.json();
        if(data.result === "success") {
            ratesData = data.conversion_rates;
            displayRates();
        }
    } catch (e) { console.error("Error fetching data"); }
}

function displayRates() {
    if (!ratesData.DZD) return;
    const t = translations[currentLang];
    const usdToDzd = ratesData.DZD;
    const currencies = [
        {code:"EUR", flag:"eu"}, {code:"USD", flag:"us"},
        {code:"GBP", flag:"gb"}, {code:"SAR", flag:"sa"}, {code:"AED", flag:"ae"}
    ];

    const container = document.getElementById('rates-container');
    container.innerHTML = "";
    
    currencies.forEach(c => {
        const priceInDzd = usdToDzd / ratesData[c.code];
        container.innerHTML += `
            <div class="rate-card">
                <div style="display:flex; align-items:center; gap:10px;">
                    <img src="https://flagcdn.com/w40/${c.flag}.png" width=30>
                    <span>${t.currencies[c.code]}</span>
                </div>
                <b>${priceInDzd.toFixed(2)} ${t.unit}</b>
            </div>`;
    });
}

function performConversion() {
    const amount = document.getElementById('calc-input').value;
    const from = document.getElementById('from-currency').value;
    const to = document.getElementById('to-currency').value;
    if (amount && ratesData[from] && ratesData[to]) {
        const result = (amount / ratesData[from]) * ratesData[to];
        document.getElementById('calc-result').innerText = result.toLocaleString(undefined, {maximumFractionDigits: 2});
    }
}

document.getElementById('calc-input').addEventListener('input', performConversion);
document.getElementById('from-currency').addEventListener('change', performConversion);
document.getElementById('to-currency').addEventListener('change', performConversion);

getRates();
setLanguage('en'); // اللغة الافتراضية عند الدخول
setInterval(() => {
    const now = new Date();
    document.getElementById('clock').innerText = now.toLocaleTimeString('en-GB');
}, 1000);
