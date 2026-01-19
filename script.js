const apiKey = "fb87de9454864be34e7cbc88";
let ratesData = {};
let currentLang = 'en';

// نسبة الفرق بين البنك والسكوار (مثلاً 1.35 تعني زيادة 35%)
const squareFactor = 1.35; 

const translations = {
    en: {
        bank: "Bank Rate",
        square: "Parallel Market (Square)",
        unit: "DA",
        dateLocale: "en-GB",
        currencies: { EUR: "Euro", USD: "US Dollar", GBP: "Pound", CAD: "CAD", SEK: "SEK", TRY: "TRY", SAR: "SAR", AED: "AED", DZD: "DZD" }
    },
    ar: {
        bank: "سعر البنك الرسمي",
        square: "سعر السكوار (الموازي)",
        unit: "دج",
        dateLocale: "ar-DZ",
        currencies: { EUR: "الأورو", USD: "الدولار", GBP: "الجنيه", CAD: "الكندي", SEK: "السويدي", TRY: "التركي", SAR: "الريال", AED: "الدرهم", DZD: "الدينار" }
    },
    fr: {
        bank: "Taux Bancaire",
        square: "Marché Parallèle (Square)",
        unit: "DA",
        dateLocale: "fr-FR",
        currencies: { EUR: "Euro", USD: "Dollar US", GBP: "Livre", CAD: "CAD", SEK: "SEK", TRY: "TRY", SAR: "SAR", AED: "AED", DZD: "DZD" }
    }
};

const activeCurrencies = [
    {code:"EUR", flag:"eu"}, {code:"USD", flag:"us"},
    {code:"GBP", flag:"gb"}, {code:"CAD", flag:"ca"},
    {code:"SEK", flag:"se"}, {code:"TRY", flag:"tr"},
    {code:"SAR", flag:"sa"}, {code:"AED", flag:"ae"}
];

function updateDateTime() {
    const now = new Date();
    const t = translations[currentLang];
    document.getElementById('clock').innerText = now.toLocaleTimeString('en-GB');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('date').innerText = now.toLocaleDateString(t.dateLocale, options);
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
    const usdToDzdBank = ratesData.DZD;
    const container = document.getElementById('rates-container');
    container.innerHTML = "";
    
    activeCurrencies.forEach(c => {
        const priceBank = usdToDzdBank / ratesData[c.code];
        const priceSquare = priceBank * squareFactor; // حساب سعر السكوار

        container.innerHTML += `
            <div class="rate-card" style="border-left: 4px solid #4caf50; margin-bottom: 10px; padding: 10px; background: #2a2a2a; border-radius: 8px;">
                <div style="display:flex; align-items:center; gap:10px; margin-bottom:5px;">
                    <img src="https://flagcdn.com/w40/${c.flag}.png" width=25>
                    <span style="font-weight:bold;">${t.currencies[c.code]} (${c.code})</span>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:0.9rem;">
                    <span>${t.bank}:</span>
                    <span style="color:#bbb;">${priceBank.toFixed(2)} ${t.unit}</span>
                </div>
                <div style="display:flex; justify-content:space-between; font-weight:bold; color:#4caf50;">
                    <span>${t.square}:</span>
                    <span>${priceSquare.toFixed(2)} ${t.unit}</span>
                </div>
            </div>`;
    });
}

function setLanguage(lang) {
    currentLang = lang;
    updateDateTime();
    displayRates();
    // (بقية أكواد التحديث للنصوص الأخرى تبقى كما هي)
}

getRates();
setInterval(updateDateTime, 1000);
setLanguage('en');
