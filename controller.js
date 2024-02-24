import { DB } from "./model.js";

$(document).ready(function () {
  renderApp();
});

// function to render the app at the beggining
function renderApp() {
  fetchMenu();
}

// ******Functions******
// Menu
function returnFilterButtons() {
    var categories = ["All", "Beer", "Wine", "Spirit"];
    categories.forEach((category) => {
      $(".filter-buttons").append(
        `<button type="button" class="secondary-btn">${category}</button>`
      );
      $('.filter-buttons .secondary-btn').on('click', function() {
        const categoryName = $(this).text();
        showMenu(categoryName);
      });
    });
  }

function showMenu(categoryName) {
  const productsDiv = document.getElementById("products");
  productsDiv.innerHTML = ""; // Clear the products display

  let filteredProducts;
  // Filter products based on the selected category
  if (categoryName == "All") {
    filteredProducts = DB.products;
  } else {
    filteredProducts = DB.products.filter(
      (product) => product.type == categoryName
    );
  }

  // Iterate through filtered products and create elements for each
  filteredProducts.forEach((product) => {
    const div = document.createElement("div");
    div.classList.add("product-item");
    div.textContent = `${product.name} - ${product.price}kr`;

    // Add an event handler to add the product to the cart when clicked
    div.onclick = function () {
      addToCart(product.name, product.price);
    };

    // Append the product element to the products display
    productsDiv.appendChild(div);
  });
}

function fetchMenu() {
  returnFilterButtons();
  showMenu('All');
  $("#menu-container").show();
}
