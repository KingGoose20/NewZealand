class Purchase {
    constructor(name, price, startDate, endDate) {
        this.name = name;
        this.price = price;
        this.startDate = startDate; // "dd/mm/yyyy"
        this.endDate = endDate;     // "dd/mm/yyyy"
    }

    // --- Helper: convert dd/mm/yyyy → Date ---
    static parseDate(dateStr) {
        const [day, month, year] = dateStr.split("/").map(Number);
        return new Date(year, month - 1, day); // JS months are 0-based
    }

    // --- Calculate number of days (inclusive) ---
    getDurationDays() {
        const start = Purchase.parseDate(this.startDate);
        const end = Purchase.parseDate(this.endDate);

        const msPerDay = 1000 * 60 * 60 * 24;
        return Math.max(Math.floor((end - start) / msPerDay), 1);
    }

    // --- Cost per day ---
    costPerDay() {
        const days = this.getDurationDays();
        return (this.price / days).toFixed(2);
    }

    costPerPersonPerDay() {
        return (this.costPerDay() / 9).toFixed(2);
    }

    // --- Check if a date is within range ---
    isWithinRange(dateStr) {
        const date = Purchase.parseDate(dateStr);
        const start = Purchase.parseDate(this.startDate);
        const end = Purchase.parseDate(this.endDate);

        return date >= start && date <= end;
    }
}

const allPurchases = [
    new Purchase("Car Rental", 3980, "16/01/2026", "28/01/2026"),
    new Purchase("Southern Laughter Backpackers Accomodation", 336.32, "16/01/2026", "16/01/2026"),
    new Purchase("Wonderland Makarora Lodge Camping", 215, "17/01/2026", "17/01/2026"),
]

function basePages() {
    console.log("HERE");
    const pricing = document.getElementById('pricing');
    const day = pricing.dataset.date;
    const ul = document.createElement("ul");
    var dayTotal = 0;

    function createList(element) {
        const li = document.createElement("li");
        li.innerHTML =
            `<strong>${element.name}:</strong> ` +
            `${element.costPerDay()} ` +
            `(${element.costPerPersonPerDay()}pp)`;
        ul.appendChild(li);
    }

    for (i = 0; i < allPurchases.length; i++) {
        if (allPurchases[i].isWithinRange(day)) {
            createList(allPurchases[i]);
            console.log(allPurchases[i].price);
            dayTotal += allPurchases[i].price / allPurchases[i].getDurationDays();
        }
    }
    createList(new Purchase("Day Total", dayTotal, "01/01/2025", "01/01/2025"));

    // 3. Add the <ul> to an existing HTML element
    document.getElementById("pricing").appendChild(ul);
}




// ---------------- FUNCTION 1 ----------------
function createCostPerDayTableAllDates() {
    const container = document.getElementById("dayPurchases");
    container.innerHTML = ""; // clear existing content

    const startDate = Purchase.parseDate("16/01/2026");
    const endDate = Purchase.parseDate("28/01/2026");
    const msPerDay = 1000 * 60 * 60 * 24;

    let dayNumber = 1;

    // Loop through each day
    for (let d = startDate.getTime(); d <= endDate.getTime(); d += msPerDay) {
        const currentDate = new Date(d);
        const dayStr = currentDate.toLocaleDateString("en-GB"); // dd/mm/yyyy

        // Create table for this day
        const table = document.createElement("table");
        table.style.marginBottom = "45px";
        table.innerHTML = `
            <caption><strong>Day ${dayNumber} | ${dayStr}</strong></caption>
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Cost / Day</th>
                    <th>Cost / Person / Day</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;
        const tbody = table.querySelector("tbody");
        let dayTotal = 0;

        allPurchases.forEach(p => {
            if (p.isWithinRange(dayStr)) {
                const costDay = Number(p.costPerDay());
                dayTotal += costDay;

                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${p.name}</td>
                    <td>$${costDay.toFixed(2)}</td>
                    <td>$${p.costPerPersonPerDay()}</td>
                `;
                tbody.appendChild(row);
            }
        });

        // Day total row
        const totalRow = document.createElement("tr");
        totalRow.innerHTML = `
            <td><strong>Day Total</strong></td>
            <td><strong>$${dayTotal.toFixed(2)}</strong></td>
            <td><strong>$${(dayTotal / 9).toFixed(2)}</strong></td>
        `;
        tbody.appendChild(totalRow);

        container.appendChild(table);
        dayNumber++;
    }
}



// ---------------- FUNCTION 2 ----------------
function createAllPurchasesTable(purchases) {
    var purchases = allPurchases;
    var container = document.getElementById("allPurchases");
    const table = document.createElement("table");
    table.innerHTML = `
        <thead>
            <tr>
                <th>Name</th>
                <th>Total Price</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Days</th>
                <th>Cost / Day</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

    const tbody = table.querySelector("tbody");

    purchases.forEach(p => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${p.name}</td>
            <td>$${p.price.toFixed(2)}</td>
            <td>${p.startDate}</td>
            <td>${p.endDate}</td>
            <td>${p.getDurationDays()}</td>
            <td>$${p.costPerDay()}</td>
        `;
        tbody.appendChild(row);
    });

    container.appendChild(table);
}

function createDailyTotalsTable() {
    const container = document.getElementById("dayPurchasesSummary");
    container.innerHTML = ""; // clear previous content

    const startDate = Purchase.parseDate("16/01/2026");
    const endDate = Purchase.parseDate("28/01/2026");
    const msPerDay = 1000 * 60 * 60 * 24;

    const table = document.createElement("table");
    table.innerHTML = `
        <thead>
            <tr>
                <th>Date</th>
                <th>Day #</th>
                <th>Total Cost</th>
                <th>Cost / Person</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;
    const tbody = table.querySelector("tbody");

    let dayNumber = 1;

    for (let d = startDate.getTime(); d <= endDate.getTime(); d += msPerDay) {
        const currentDate = new Date(d);
        const dayStr = currentDate.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit" }); // dd/mm

        // calculate total cost for this day
        let dayTotal = 0;
        allPurchases.forEach(p => {
            if (p.isWithinRange(currentDate.toLocaleDateString("en-GB"))) {
                dayTotal += Number(p.costPerDay());
            }
        });

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${dayStr}</td>
            <td>${dayNumber}</td>
            <td>$${dayTotal.toFixed(2)}</td>
            <td>$${(dayTotal / 9).toFixed(2)}</td>
        `;
        tbody.appendChild(row);

        dayNumber++;
    }

    container.appendChild(table);
}

function createTotals() {
    var total = 0;
    allPurchases.forEach(p => {
        total += p.price;
    });
    document.getElementById("total").innerHTML += total;
    document.getElementById("totalPerson").innerHTML += (total / 9).toFixed(2);
}