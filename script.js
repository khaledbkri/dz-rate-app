const apiKey = "fb87de9454864be34e7cbc88";
let ratesData = {};

function updateTime() {
    setInterval(() => {
        const now = new Date();
        document.getElementById('clock').innerText = now.toLocaleTimeString('en-GB');
        document.getElementById('date').innerText = now.toLocaleDateString('ar-DZ', {weekday:'long', day:'numeric', month:'long'});
    }, 1000);
}

async function getRates() {
    try {
        const res = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`);
        const data = await res.json();
        ratesData = data.conversion_rates;
        const usdToDzd = ratesData.DZD;

        const list = [
            {name:"الأورو", code:"EUR", flag:"eu"},
            {name:"الدولار", code:"USD", flag:"us"},
            {name:"الجنيه", code:"GBP", flag:"gb"},
            {name:"السعودي", code:"SAR", flag:"sa"},
            {name:"الإماراتي", code:"AED", flag:"ae"}
        ];

        const container = document.getElementById('rates-container');
        container.innerHTML = "";
        list.forEach(c => {
            const price = usdToDzd / ratesData[c.code];
            container.innerHTML += `
                <div class="rate-card">
                    <img src="https://flagcdn.com/w40/${c.flag}.png">
                    <span>${c.name}</span>
                    <b>${price.toFixed(2)} دج</b>
                </div>`;
        });
    } catch (e) { console.log("Error fetching rates"); }
}

document.getElementById('calc-input').addEventListener('input', () => {
    const val = document.getElementById('calc-input').value;
    const code = document.getElementById('calc-select').value;
    const res = val * (ratesData.DZD / ratesData[code]);
    document.getElementById('calc-result').innerText = res.toLocaleString();
});

updateTime();
getRates();
setInterval(getRates, 300000); // تحديث الأسعار كل 5 دقائق
