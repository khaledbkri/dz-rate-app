const apiKey = "fb87de9454864be34e7cbc88";
let ratesData = {};
let currentLang = 'en';
const squareFactor = 1.35; 

const translations = {
    en: { bank: "Bank Rate", square: "Parallel Market", unit: "DA", calc: "Converter", res: "Result" },
    ar: { bank: "سعر البنك", square: "السوق الموازي", unit: "دج", calc: "محول العملات", res: "النتيجة" },
    fr: { bank: "Taux Banque", square: "Marché Parallèle", unit: "DA", calc: "Convertisseur", res: "Résultat" }
};

const activeCurrencies = [
    {code:"EUR", flag:"eu", name:{en:"Euro", ar:"الأورو", fr:"Euro"}},
    {code:"USD", flag:"us", name:{en:"US Dollar", ar:"الدولار", fr:"Dollar"}},
    {code:"SAR", flag:"sa", name:{en:"Saudi Riyal", ar:"الريال السعودي", fr:"Riyal"}}
];

async function getRates() {
    try {
        const res = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`);
        const data = await res.json();
        if(data.result === "success") {
            ratesData = data.conversion_rates;
            populateSelects();
            displayRates();
        }
    } catch (e) { console.log("Error"); }
}

function populateSelects() {
    const from = document.getElementById('from-currency');
    const to = document.getElementById('to-currency');
    const options = ["DZD", "EUR", "USD", "SAR", "GBP", "CAD", "SEK"];
    
    from.innerHTML = ""; to.innerHTML = "";
    options.forEach(code => {
        from.innerHTML += `<option value="${code}">${code}</option>`;
        to.innerHTML += `<option value="${code}">${code}</option>`;
    });
    from.value = "EUR"; to.value = "DZD";
}

function displayRates() {
    const t = translations[currentLang];
    const container = document.getElementById('rates-container');
    container.innerHTML = "";
    
    activeCurrencies.forEach(c => {
        const priceBank = ratesData.DZD / ratesData[c.code];
        const priceSquare = priceBank * squareFactor;

        container.innerHTML += `
            <div class="rate-card">
                <div class="card-header">
                    <div class="currency-info">
                        <img src="https://flagcdn.com/w40/${c.flag}.png" width="30">
                        <span class="currency-name">${c.name[currentLang]} (${c.code})</span>
                    </div>
                </div>
                <div class="price-main">
                    <div class="square-box">
                        <span class="square-value">${priceSquare.toFixed(2)} ${t.unit}</span>
                        <span class="square-label">${t.square}</span>
                    </div>
                    <div class="bank-info">
                        <small>${t.bank}</small><br>
                        <span class="bank-value">${priceBank.toFixed(2)} ${t.unit}</span>
                    </div>
                </div>
            </div>`;
    });
}

function calculate() {
    const amount = document.getElementById('calc-input').value;
    const from = document.getElementById('from-currency').value;
    const to = document.getElementById('to-currency').value;
    if(amount && ratesData[from]) {
        const res = (amount / ratesData[from]) * ratesData[to];
        document.getElementById('calc-result').innerText = res.toFixed(2);
    }
}

document.getElementById('calc-input').addEventListener('input', calculate);
getRates();
