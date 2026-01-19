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
        currencies: { 
            EUR: "Euro", USD: "US Dollar", GBP: "Pound Sterling", 
            CAD: "Canadian Dollar", SEK: "Swedish Krona", TRY: "Turkish Lira", 
            SAR: "Saudi Riyal", AED: "UAE Dirham", DZD: "Algerian Dinar" 
        },
        unit: "DA",
        dateLocale: "en-GB"
    },
    ar: {
        title: "ديزاد ريت <span>مباشر</span>",
        calcTitle: "محول العملات الذكي",
        placeholder: "أدخل المبلغ...",
        result: "النتيجة",
        dir: "rtl",
        currencies: { 
            EUR: "الأورو", USD: "الدولار الأمريكي", GBP: "الجنيه الإسترليني", 
            CAD: "الدولار الكندي", SEK: "الكرونة السويدية", TRY: "الليرة التركية", 
            SAR: "الريال السعودي", AED: "الدرهم الإماراتي", DZD: "الدينار الجزائري" 
        },
        unit: "دج",
        dateLocale: "ar-DZ"
    },
    fr: {
        title: "DzRate <span>Direct</span>",
        calcTitle: "Convertisseur",
        placeholder: "Montant...",
        result: "Résultat",
        dir: "ltr",
        currencies: { 
            EUR: "Euro", USD: "Dollar US", GBP: "Livre Sterling", 
            CAD: "Dollar Canadien", SEK: "Couronne Suédoise", TRY: "Lire Turque", 
            SAR: "Riyal Saoudien", AED: "Dirham EAU", DZD: "Dinar Algérien" 
        },
        unit: "DA",
        dateLocale: "fr-FR"
    }
};

const activeCurrencies = [
    {code:"EUR", flag:"eu"}, {code:"USD", flag:"us"},
    {code:"GBP", flag:"gb"}, {code:"CAD", flag:"ca"},
    {code:"SEK", flag:"se"}, {code:"TRY", flag:"tr"},
    {code:"SAR", flag:"sa"}, {code:"AED", flag:"ae"}
];

// دالة تحديث الوقت والتاريخ فوراً
function updateDateTime() {
    const now = new Date();
    const t = translations[currentLang];
    
    // تحديث الساعة
    document.getElementById('clock').innerText = now.toLocaleTimeString('en-GB');
    
    // تحديث التاريخ (لحل مشكلة Loading)
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('date').innerText = now.toLocaleDateString(t.dateLocale, options);
}

function setLanguage(lang) {
    currentLang = lang;
    const t = translations[lang];
    document.documentElement.lang = lang;
    document.documentElement.dir = t.dir;
    document.getElementById('app-title').innerHTML = t.title;
    document.getElementById('calc-title').innerText = t.calcTitle;
    document.getElementById('calc-input').placeholder = t.placeholder;
    document.getElementById('res-text').innerText = t.result;
    
    updateDateTime(); // تحديث التاريخ فور تغيير اللغة
    updateSelectOptions();
    displayRates();
    performConversion();
}

function updateSelectOptions() {
    const fromSelect = document.getElementById('from-currency');
    const toSelect = document.getElementById('to-currency');
    const t = translations[currentLang];
    const options = [...activeCurrencies, {code: "DZD", flag: "dz"}];
    
    let html = "";
    options.forEach(c => {
        html += `<option value="${c.code}">${t.currencies[c.code]} (${c.code})</option>`;
    });
    
    const currentFrom = fromSelect.value || "EUR";
    const currentTo = toSelect.value || "DZD";
    fromSelect.innerHTML = html;
    toSelect.innerHTML = html;
    fromSelect.value = currentFrom;
    toSelect.value = currentTo;
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
    const container = document.getElementById('rates-container');
    container.innerHTML = "";
    
    activeCurrencies.forEach(c => {
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
        document.getElementById('calc-result').innerText = result.toLocaleString(undefined, {maximumFractionDigits: 2}) + " " + to;
    } else {
        document.getElementById('calc-result').innerText = "0";
    }
}

document.getElementById('calc-input').addEventListener('input', performConversion);
document.getElementById('from-currency').addEventListener('change', performConversion);
document.getElementById('to-currency').addEventListener('change', performConversion);

// التشغيل
getRates();
setLanguage('en'); 
setInterval(updateDateTime, 1000); // تحديث الساعة والتاريخ كل ثانية
setInterval(getRates, 300000);
