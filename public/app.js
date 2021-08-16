function htmlPostCreate(){
    // Get create form
    var form = document.getElementById('new-workout');
    
    // Add create form event listener
    form.addEventListener('submit', function(e){
        e.preventDefault();
        var req = new XMLHttpRequest();
        var name = document.getElementById('new-name').value || null;
        var reps = document.getElementById('new-reps').value;
        var weight = document.getElementById('new-weight').value;
        var date = document.getElementById('new-date').value || new Date();
        date = new Date(date).toISOString();
        date = date.slice(0, date.indexOf('T'));
        var lbs = document.getElementById('new-unit').value === 'lbs' ? 1:0;
        if(name === null){
            clearForm();
            return;
        }
        // var url = `http://flip3.engr.oregonstate.edu:3000/?query=create&name=${name}&reps=${reps}&weight=${weight}&date=${date}&lbs=${lbs}`;
        var url = `http://localhost:3000/?query=create&name=${name}&reps=${reps}&weight=${weight}&date=${date}&lbs=${lbs}`;
        req.onload = function(){
            if(req.status === 200){
                // Update HTML table with new workout after ok http request
                var workout = {
                    id: req.responseText,
                    name: name,
                    reps: reps,
                    weight: weight,
                    date: date,
                    lbs: lbs
                };
                appendTableRow(workout);
                // Clear create form
                clearForm();
            }
        }; 
        req.open('POST', url, true);
        req.send();
    });
}

function clearForm(){
    document.getElementById('new-name').value = null;
    document.getElementById('new-reps').value = null;
    document.getElementById('new-weight').value = null;
    document.getElementById('new-date').value = null;
    document.getElementById('new-unit').value = 'lbs';
}

function htmlPostRead(){
    var req = new XMLHttpRequest();
    // var url = 'http://flip3.engr.oregonstate.edu:3000/?query=read';
    var url = 'http://localhost:3000/?query=read';
    req.onload = function(){
        if(req.status === 200){
            var workouts = JSON.parse(req.responseText);
            workouts.forEach(function(workout){
                appendTableRow(workout);
            });
        }
    }
    req.open('POST', url, true);
    req.send();
}

function appendTableRow(workout){
    var id = workout.id;
    var name = workout.name;
    var reps = workout.reps;
    var weight = workout.weight;
    var date = workout.date;
    var lbs = workout.lbs;

    // Get table
    var table = document.getElementById('workouts-table');

    // Append table row
    var tableRow = document.createElement('div');
    tableRow.style.display = 'table-row';
    tableRow.width = '100%';
    tableRow.id = `row-${id}`;
    table.appendChild(tableRow);

    // Append id table cell
    var idCell = document.createElement('div');
    idCell.style.display = 'table-cell';
    var idInput = document.createElement('input');
    idInput.id = `id-${id}`;
    idInput.type = 'hidden';
    idInput.name = 'id';
    idInput.value = `${id}`;
    idCell.appendChild(idInput);
    tableRow.appendChild(idCell);

    // Append name table cell
    var nameCell = document.createElement('div');
    nameCell.style.display = 'table-cell';
    var nameInput = document.createElement('input');
    nameInput.id = `name-${id}`;
    nameInput.type = 'text';
    nameInput.name = 'name';
    nameInput.value = `${name}`;
    nameCell.appendChild(nameInput);
    tableRow.appendChild(nameCell);

    // Append reps table cell
    var repsCell = document.createElement('div');
    repsCell.style.display = 'table-cell';
    var repsInput = document.createElement('input');
    repsInput.id = `reps-${id}`;
    repsInput.type = 'number';
    repsInput.name = 'reps';
    repsInput.value = `${reps}`;
    repsCell.appendChild(repsInput);
    tableRow.appendChild(repsCell);

    // Append weight table cell
    var weightCell = document.createElement('div');
    weightCell.style.display = 'table-cell';
    var weightInput = document.createElement('input');
    weightInput.id = `weight-${id}`;
    weightInput.type = 'number';
    weightInput.name = 'weight';
    weightInput.value = `${weight}`;
    weightCell.appendChild(weightInput);
    tableRow.appendChild(weightCell);

    // Append date table cell
    var dateCell = document.createElement('div');
    dateCell.style.display = 'table-cell';
    var dateInput = document.createElement('input');
    dateInput.id = `date-${id}`;
    dateInput.type = 'date';
    dateInput.name = 'date';
    dateInput.value = date;
    dateCell.appendChild(dateInput);
    tableRow.appendChild(dateCell);

    // Append unit table cell
    var unitCell = document.createElement('div');
    unitCell.style.display = 'table-cell';
    // Form select
    var unitSelect = document.createElement('select');
    unitSelect.id = `unit-${id}`;
    unitSelect.name = 'unit';
    // Form select lbs option
    var unitOptionLbs = document.createElement('option');
    unitOptionLbs.value = 'lbs';
    unitOptionLbs.textContent = 'lbs';
    // Form select kgs option
    var unitOptionKgs = document.createElement('option');
    unitOptionKgs.value = 'kgs';
    unitOptionKgs.textContent = 'kgs';
    // Append select options
    if(lbs === 1){
        unitSelect.appendChild(unitOptionLbs);
        unitSelect.appendChild(unitOptionKgs);
    }else{
        unitSelect.appendChild(unitOptionKgs);
        unitSelect.appendChild(unitOptionLbs);
    }
    unitCell.appendChild(unitSelect);
    tableRow.appendChild(unitCell);

    // Append update table cell
    var updateCell = document.createElement('div');
    updateCell.style.display = 'table-cell';
    var updateInput = document.createElement('input');
    updateInput.id = `update-${id}`;
    updateInput.type = 'button';
    updateInput.name = 'update';
    updateInput.value = 'Update';
    updateCell.appendChild(updateInput);
    tableRow.appendChild(updateCell);

    // Add update event listener
    updateInput.addEventListener('click', function(e){
        e.preventDefault();
        var workout = {
            id: idInput.value,
            name: nameInput.value,
            reps: repsInput.value,
            weight: weightInput.value,
            date: dateInput.value,
            lbs: unitSelect.value === 'lbs' ? 1:0
        };
        htmlPostUpdate(workout);
    });

    // Append delete table cell
    var deleteCell = document.createElement('div');
    deleteCell.style.display = 'table-cell';
    var deleteInput = document.createElement('input');
    deleteInput.id = `delete-${id}`;
    deleteInput.type = 'button';
    deleteInput.name = 'delete';
    deleteInput.value = 'Delete';
    deleteCell.appendChild(deleteInput);
    tableRow.appendChild(deleteCell);

    // Add delete event listener
    deleteInput.addEventListener('click', function(e){
        e.preventDefault();
        // Client delete workout
        var index = Array.from(table.children).reduce(function(acc, val, idx){
            return val.id === `row-${idInput.value}` ? acc+idx:acc;
        }, 0);
        table.removeChild(table.children[index]);
        // Server delete workout
        htmlPostDelete(idInput.value);
    });
}

function htmlPostUpdate(workout){
    var req = new XMLHttpRequest();
    var id = workout.id;
    var name = workout.name;
    var reps = workout.reps;
    var weight = workout.weight;
    var date = workout.date;
    var lbs = workout.lbs;
    // var url = `http://flip3.engr.oregonstate.edu:3000/?query=update&id=${id}&name=${name}&reps=${reps}&weight=${weight}&date=${date}&lbs=${lbs}`;
    var url = `http://localhost:3000/?query=update&id=${id}&name=${name}&reps=${reps}&weight=${weight}&date=${date}&lbs=${lbs}`;
    req.open('POST', url, true);
    req.send();
}

function htmlPostDelete(id){
    var req = new XMLHttpRequest();
    // var url = `http://flip3.engr.oregonstate.edu:3000/?query=delete&id=${id}`;
    var url = `http://localhost:3000/?query=delete&id=${id}`;
    req.open('POST', url, true);
    req.send();
}

/**
 * Main
 */

htmlPostCreate();
htmlPostRead();
