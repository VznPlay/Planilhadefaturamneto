let dailyValues = [];
let currentWeek = 1;
let currentDayIndex = 0;
let monthCounter = 1;
let monthlyTotals = [];
let monthlySummaries = []; // Array para armazenar os resumos mensais

const MAX_WEEKS = 5; // Modificado para 5 semanas, onde a última será a "Extra"
const daysOfWeek = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

// Verifica se existem dados salvos no localStorage ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('monthlyData')) {
        const savedData = JSON.parse(localStorage.getItem('monthlyData'));
        dailyValues = savedData.dailyValues || [];
        monthlyTotals = savedData.monthlyTotals || [];
        monthlySummaries = savedData.monthlySummaries || [];
        monthCounter = savedData.monthCounter || 1;
        currentWeek = savedData.currentWeek || 1;
        currentDayIndex = savedData.currentDayIndex || 0;
        updatePage();
    }
});

// Adiciona evento para pressionar Enter
document.getElementById('daily-value').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        addDailyValue();
    }
});

function addDailyValue() {
    const dailyInput = document.getElementById('daily-value');
    const value = parseFloat(dailyInput.value);

    if (!isNaN(value)) {
        if (currentWeek > MAX_WEEKS) {
            alert("Limite de semanas atingido!");
            return;
        }

        dailyValues.push(value);

        let weekDiv = document.getElementById(`week-${currentWeek}`);
        if (!weekDiv) {
            weekDiv = document.createElement('div');
            weekDiv.id = `week-${currentWeek}`;
            weekDiv.className = 'week';
            weekDiv.innerHTML = `<strong>${currentWeek === 5 ? 'Extra' : 'Semana ' + currentWeek}</strong>`;
            document.getElementById('weekly-display').appendChild(weekDiv);
        }

        const dayDiv = document.createElement('div');
        dayDiv.textContent = `${daysOfWeek[currentDayIndex]}: R$ ${value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
        weekDiv.appendChild(dayDiv);

        currentDayIndex = (currentDayIndex + 1) % 7;
        if (currentDayIndex === 0) {
            currentWeek++;
        }

        dailyInput.value = '';
        saveData();
    } else {
        alert('Por favor, insira um valor válido.');
    }
}

function finalizeMonth() {
    if (dailyValues.length === 0) {
        alert('Nenhum valor foi adicionado para o mês.');
        return;
    }

    const total = dailyValues.reduce((sum, value) => sum + value, 0);
    const monthSummary = {
        month: monthNames[monthCounter - 1],
        total: total
    };

    monthlySummaries.push(monthSummary);

    const monthSummaryDiv = document.createElement('div');
    monthSummaryDiv.innerHTML = `<strong>${monthSummary.month}:</strong> Faturamento Total: R$ ${total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
    document.getElementById('monthly-summary').appendChild(monthSummaryDiv);

    monthlyTotals.push(total);

    dailyValues = [];
    currentWeek = 1;
    currentDayIndex = 0;
    document.getElementById('weekly-display').innerHTML = '';
    document.getElementById('month-title').textContent = `Mês de ${monthNames[monthCounter]}`;
    monthCounter++;

    if (monthCounter > 12) {
        monthCounter = 1;
    }

    saveData();
}

function calculateAnnualTotal() {
    const annualTotal = monthlyTotals.reduce((sum, value) => sum + value, 0);
    document.getElementById('annual-summary').classList.remove('hidden');
    document.getElementById('annual-total').textContent = `Faturamento Anual: R$ ${annualTotal.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}

function resetAllData() {
    if (confirm("Deseja realmente resetar todos os dados?")) {
        dailyValues = [];
        monthlyTotals = [];
        monthlySummaries = [];
        currentWeek = 1;
        currentDayIndex = 0;
        monthCounter = 1;

        document.getElementById('weekly-display').innerHTML = '';
        document.getElementById('monthly-summary').innerHTML = '';
        document.getElementById('annual-summary').classList.add('hidden');
        document.getElementById('annual-total').textContent = '';
        document.getElementById('month-title').textContent = `Mês de ${monthNames[0]}`;

        saveData();
    }
}

function saveData() {
    const data = {
        dailyValues: dailyValues,
        monthlyTotals: monthlyTotals,
        monthlySummaries: monthlySummaries,
        monthCounter: monthCounter,
        currentWeek: currentWeek,
        currentDayIndex: currentDayIndex
    };
    localStorage.setItem('monthlyData', JSON.stringify(data));
}

function updatePage() {
    document.getElementById('month-title').textContent = `Mês de ${monthNames[monthCounter - 1]}`;
    document.getElementById('monthly-summary').innerHTML = '';
    document.getElementById('annual-summary').classList.add('hidden');

    let weekDiv;
    dailyValues.forEach((value, index) => {
        const weekNum = Math.floor(index / 7) + 1;
        weekDiv = document.getElementById(`week-${weekNum}`);
        if (!weekDiv) {
            weekDiv = document.createElement('div');
            weekDiv.id = `week-${weekNum}`;
            weekDiv.className = 'week';
            weekDiv.innerHTML = `<strong>${weekNum === 5 ? 'Extra' : 'Semana ' + weekNum}</strong>`;
            document.getElementById('weekly-display').appendChild(weekDiv);
        }
        const dayDiv = document.createElement('div');
        dayDiv.textContent = `${daysOfWeek[index % 7]}: R$ ${value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
        weekDiv.appendChild(dayDiv);
    });

    monthlySummaries.forEach(summary => {
        const monthSummaryDiv = document.createElement('div');
        monthSummaryDiv.innerHTML = `<strong>${summary.month}:</strong> Faturamento Total: R$ ${summary.total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
        document.getElementById('monthly-summary').appendChild(monthSummaryDiv);
    });
}


