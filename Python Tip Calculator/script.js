function calculateTip() {
    const totalBill = parseFloat(document.getElementById('totalBill').value);
    const tipPercentage = parseInt(document.getElementById('tipPercentage').value);
    const numberOfPeople = parseInt(document.getElementById('numberOfPeople').value);
    const salesTax = 0.10 * totalBill;

    const tipAmount = parseFloat((tipPercentage / 100) * totalBill).toFixed(2);
    const totalWithTipAndTax = parseFloat(totalBill + parseFloat(tipAmount) + salesTax).toFixed(2);
    const paymentPerPerson = parseFloat(totalWithTipAndTax / numberOfPeople).toFixed(2);

    document.getElementById('results').innerHTML = `
        <p>Tip amount: $${tipAmount}</p>
        <p>Total bill including tip: $${totalWithTipAndTax}</p>
        <p>Each person owes: $${paymentPerPerson}</p>
    `;
}
