const apiKey = "fb87de9454864be34e7cbc88";
let ratesData = {};

// تحديث الساعة والتاريخ
function updateTime() {
    setInterval(() => {
        const now = new Date();
        document.getElementById('clock').innerText = now.toLocaleTimeString('en-GB');
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('date').innerText = now.toLocaleDateString('ar-DZ', options);
    }, 1000);
}

// جلب الأسعار من الـ API
async function getRates() {
    try {
        const res = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`);
        const data = await res.json();
        if(data.result === "success") {
            ratesData = data.conversion_rates;
            displayRates();
        }
    } catch (e) {
        console.error("خطأ في جلب البيانات");
    }
}

// عرض بطاقات الأسعار
function displayRates() {
    const usdToDzd = ratesData.DZD;
    const currencies = [
        {name:"الأورو", code:"EUR", flag:"eu"},
        {name:"الدولار", code:"USD", flag:"us"},
        {name:"الجنيه", code:"GBP", flag:"gb"},
        {name:"السعودي", code:"SAR", flag:"sa"},
        {name:"الإماراتي", code:"AED", flag:"ae"}
    ];

    const container = document.getElementById('rates-container');
    container.innerHTML = "";
    
    currencies.forEach(c => {
        const priceInDzd = usdToDzd / ratesData[c.code];
        container.innerHTML += `
            <div class="rate-card">
                <div style="display:flex; align-items:center; gap:10px;">
                    <img src="https://flagcdn.com/w40/${c.flag}.png" width="30">
                    <span>${c.name}</span>
                </div>
                <b>${priceInDzd.toFixed(2)} دج</b>
            </div>`;
    });
}

// محول العملات المطور
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

// تشغيل المستمعات
document.getElementById('calc-input').addEventListener('input', performConversion);
document.getElementById('from-currency').addEventListener('change', performConversion);
document.getElementById('to-currency').addEventListener('change', performConversion);

// التشغيل الابتدائي
updateTime();
getRates();
setInterval(getRates, 300000); // تحديث كل 5 دقائق
