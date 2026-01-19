const apiKey = "fb87de9454864be34e7cbc88";
let ratesData = {};
let currentLang = 'en';
const squareFactor = 1.35; 

const translations = {
    en: {
        bank: "Bank Rate",
        square: "Parallel Market (Square)",
        unit: "DA",
        calcTitle: "Currency Converter",
        resultText: "Result",
        placeholder: "Enter amount...",
        dateLocale: "en-GB",
        currencies: { EUR: "Euro", USD: "US Dollar", GBP: "Pound", CAD: "CAD", SEK: "SEK", TRY: "TRY", SAR: "SAR", AED: "AED", DZD: "DZD" }
    },
    ar: {
        bank: "سعر البنك الرسمي",
        square: "سعر السكوار (الموازي)",
        unit: "دج",
        calcTitle: "محول العملات",
        resultText: "النتيجة",
        placeholder: "أدخل المبلغ...",
        dateLocale: "ar-DZ",
        currencies: { EUR: "الأورو", USD: "الدولار", GBP: "الجنيه", CAD: "الكندي", SEK: "السويدي", TRY: "التركي", SAR: "الريال", AED: "الدرهم", DZD: "الدينار" }
    },
    fr: {
        bank: "Taux Bancaire",
        square: "Marché Parallèle (Square)",
        unit: "DA",
        calcTitle: "Convertisseur",
        resultText: "Résultat",
        placeholder: "Entrez le montant...",
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

// تحديث الوقت والتاريخ
function updateDateTime() {
    const now = new Date();
    const t = translations[currentLang];
    document.getElementById('clock').innerText = now.toLocaleTimeString('en-GB');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('date').innerText = now.toLocaleDateString(t.dateLocale, options);
}

// جلب البيانات وتعبئة القوائم
async function getRates() {
    try {
        const res = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`);
        const data = await res.json();
        if(data.result === "success") {
            ratesData = data.conversion_rates;
            populateSelects(); // هذه الوظيفة كانت ناقصة وهي سبب الخلل
            displayRates();
        }
    } catch (e) { console.error("Error fetching data"); }
}

// تعبئة قوائم المحول بالعملات
function populateSelects() {
    const fromSelect = document.getElementById('from-currency');
    const toSelect = document.getElementById('to-currency');
    const t = translations[currentLang];
    
    // قائمة العملات المتاحة للمحول (بما فيها الدينار)
    const allOptions = ["DZD", "EUR", "USD", "GBP", "CAD", "SEK", "TRY", "SAR", "AED"];
    
    fromSelect.innerHTML = "";
    toSelect.innerHTML = "";
    
    allOptions.forEach(code => {
        const name = t.currencies[code] || code;
        fromSelect.innerHTML += `<option value="${code}">${name} (${code})</option>`;
        toSelect.innerHTML += `<option value="${code}">${name} (${code})</option>`;
    });

    // تعيين افتراضي: من الأورو إلى الدينار
    fromSelect.value = "EUR";
    toSelect.value = "DZD";
}

// عرض بطاقات الأسعار (بنك وسكوار)
function displayRates() {
    if (!ratesData.DZD) return;
    const t = translations[currentLang];
    const usdToDzdBank = ratesData.DZD;
    const container = document.getElementById('rates-container');
    container.innerHTML = "";
    
    activeCurrencies.forEach(c => {
        const priceBank = usdToDzdBank / ratesData[c.code];
        const priceSquare = priceBank * squareFactor;

        container.innerHTML += `
            <div class="rate-card">
                <div class="card-header">
                    <img src="https://flagcdn.com/w40/${c.flag}.png" width="30">
                    <span class="currency-name">${t.currencies[c.code]} (${c.code})</span>
                </div>
                <div class="price-row">
                    <span class="price-label">${t.bank}:</span>
                    <span class="price-value-bank">${priceBank.toFixed(2)} ${t.unit}</span>
                </div>
                <div class="price-row">
                    <span class="price-label">${t.square}:</span>
                    <span class="price-value-square">${priceSquare.toFixed(2)} ${t.unit}</span>
                </div>
            </div>`;
    });
}

// منطق المحول الحسابي
function calculate() {
    const amount = document.getElementById('calc-input').value;
    const from = document.getElementById('from-currency').value;
    const to = document.getElementById('to-currency').value;
    
    if(!amount || !ratesData[from]) return;

    // التحويل يعتمد على سعر البنك الرسمي
    const result = (amount / ratesData[from]) * ratesData[to];
    document.getElementById('calc-result').innerText = result.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
}

// تغيير اللغة وتحديث النصوص
function setLanguage(lang) {
    currentLang = lang;
    const t = translations[lang];
    
    document.getElementById('calc-title').innerText = t.calcTitle;
    document.getElementById('res-text').innerText = t.resultText;
    document.getElementById('calc-input').placeholder = t.placeholder;
    
    updateDateTime();
    populateSelects(); // تحديث أسماء العملات في القائمة عند تغيير اللغة
    displayRates();
}

// الاستماع للمدخلات في المحول
document.getElementById('calc-input').addEventListener('input', calculate);
document.getElementById('from-currency').addEventListener('change', calculate);
document.getElementById('to-currency').addEventListener('change', calculate);

getRates();
setInterval(updateDateTime, 1000);
setLanguage('en');
