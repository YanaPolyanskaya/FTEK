const form = document.querySelector('.cargo_form');
const tableCargos = document.querySelector('.table tbody');
const newCardCargo = document.querySelector('.template_card');
const statusFilter = document.querySelector('.status_filter');

const STOREAGE_DATA_CARGOS = 'data_cargos';

window.onload = function () {
    loadDataFromStorage();
};
let cargosArray = [];
form.addEventListener('submit', (event) => {
    event.preventDefault();

    const nameCargo = form.querySelector('#nameCargo');
    const originCity = form.querySelector('#originCity');
    const statusCargo = form.querySelector('#statusCargo');
    const destinationCity = form.querySelector('#destinationCity');
    const departureDate = form.querySelector('#departureDate');

    const newDataCargo = {
        id: generationNambers(),
        name: nameCargo.value,
        origin: originCity.value,
        status: statusCargo.value,
        destination: destinationCity.value,
        departureDate: departureDate.value
    };

    // или можно короче
    // const formData = new FormData(form);
    // const newDataCargo = {
    //     id: generationNambers(),
    //     name: formData.get('nameCargo'),
    //     status: formData.get('statusCargo'),
    //     origin: formData.get('originCity'),
    //     destination: formData.get('destinationCity'),
    //     departureDate: formData.get('departureDate')
    // }

    if (!nameCargo.value || !originCity.value || !statusCargo.value || !destinationCity.value || !departureDate.value) {
        alert('Заполните все поля!');
        return;
    }

    cargosArray.push(newDataCargo);
    addRowToTable(newDataCargo);
    saveDataToStorage();
    form.reset();
})
function addRowToTable(data) {
    const newRow = newCardCargo.content.cloneNode(true);

    newRow.querySelector('.id').textContent = data.id;
    newRow.querySelector('.name').textContent = data.name;
    //newRow.querySelector('.status').textContent = data.status;
    newRow.querySelector('.origin').textContent = data.origin;
    newRow.querySelector('.destination').textContent = data.destination;
    newRow.querySelector('.departure_date').textContent = data.departureDate;

    const changeStatus = newRow.querySelector('.status select');
    changeStatus.value = data.status;
    const statusCell = changeStatus.closest('td');
    statusCell.classList.add('status');
    setStatusColor(changeStatus);


    changeStatus.addEventListener('change', function () {
        //changeStatus.text = changeStatus.value;
        const selectedStatus = changeStatus.value;
        if (selectedStatus === 'Доставлен') {
            const departureDate = new Date(data.departureDate);
            const currentDate = new Date();

            if (departureDate > currentDate) {
                alert('Нельзя установить статус "Доставлен", раньше указанной даты доставки');
                changeStatus.value = data.status;
                return;
            }
        }

        data.status = changeStatus.value;
        setStatusColor(changeStatus);
        saveDataToStorage();
    });

    tableCargos.appendChild(newRow);
}
function saveDataToStorage() {
    const rows = [];
    tableCargos.querySelectorAll('tr').forEach(row => {
        const rowData = {
            id: row.querySelector('.id').textContent,
            name: row.querySelector('.name').textContent,
            status: row.querySelector('.status select').value,
            origin: row.querySelector('.origin').textContent,
            destination: row.querySelector('.destination').textContent,
            departureDate: row.querySelector('.departure_date').textContent,
        };
        rows.push(rowData);
    });

    localStorage.setItem(STOREAGE_DATA_CARGOS, JSON.stringify(rows));
}

function loadDataFromStorage() {
    const savedData = localStorage.getItem(STOREAGE_DATA_CARGOS);

    if (savedData) {
        const rows = JSON.parse(savedData);
        rows.forEach(row => {
            addRowToTable(row);
            num = Math.max(num, parseInt(row.id, 10) + 1)
        });
    }
}

statusFilter.addEventListener('change', (event) => {
    const selectedStatus = event.target.value;
    filterStatus(selectedStatus);
});

function filterStatus(status) {

    tableCargos.querySelectorAll('tr').forEach(row => {
        const statusElement = row.querySelector('.status select');
        if (status === 'all') {
            row.style.display = '';
        }
        else if (statusElement && statusElement.value === status) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function setStatusColor(selectElement) {
    const statusValue = selectElement.value;
    //const statusCell = selectElement.closest('td');
    const statusSelect = selectElement;

    //statusCell.style.backgroundColor = '';
    if (statusValue === 'Ожидает отправки') {
        //statusCell.style.backgroundColor = 'yellow';
        statusSelect.style.backgroundColor = 'yellow';
    } else if (statusValue === 'В пути') {
        statusSelect.style.backgroundColor = 'blue';
    } else if (statusValue === 'Доставлен') {
        statusSelect.style.backgroundColor = 'green';
    }
}

let num = 1;
function generationNambers() {
    return num++;
}
