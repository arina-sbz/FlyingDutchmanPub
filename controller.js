$(document).ready(function() {
    renderApp();
})

// function to render the app at the beggining
function renderApp(){
    showMenu('all');
    fetchMenu();
}

// ******Functions******
// Menu container for customers 
function returnFilterButtons(){
    var categories = ['All','Beers','Wines','Cocktails'];
    categories.forEach(category => {
        $('.filter-buttons').append(
            `<button type="button" class="secondary-btn" onclick="showMenu('${category}')">${category}</button>`
        )
    });
}

function showMenu(categoryName){
    // code here 
}

function fetchMenu(){
    returnFilterButtons();
    $('#menu-container').show();
}
