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
    $(".filter-buttons .secondary-btn").on("click", function () {
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
    // Create the product item element
    const productItem = $(`
    <div class="product-item">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-price">${product.price} kr</p>
        ${
          product.alcoholstrength
            ? `<p class="product-alcohol">${product.alcoholstrength}</p>`
            : ""
        }
        ${
          product.category
            ? `<p class="product-category">${product.category}</p>`
            : ""
        }
        ${
          product.packaging
            ? `<p class="packaging">${product.packaging}</p>`
            : ""
        }
        ${
          product.productionyear
            ? `<p class="product-year">${product.productionyear}</p>`
            : ""
        }
        ${
          product.producer
            ? `<p class="product-producer">${product.producer}</p>`
            : ""
        }
        ${
          product.countryoforiginlandname
            ? `<p>${product.countryoforiginlandname}</p>`
            : ""
        }
    </div>
`);

    // Bind the click event to this specific product item
    productItem.on("click", () => {
      addToCart(product.name, product.price);
    });

    // Append the product item to the products container
    $("#products").append(productItem);
  });
}

function fetchMenu() {
  returnFilterButtons();
  showMenu("All");
  $("#menu-container").show();
}
