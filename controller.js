import { DB } from "./model.js";

// global variables
let cart = [];

$(document).ready(function () {
  renderApp();
  callEventListeners();
});

// function to render the app at the beggining
function renderApp() {
  fetchMenu();
  fetchCart();
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
      filterByType(categoryName);
    });
  });
}

// show the list of filtered products
function showMenu(filteredProducts) {
  const productsDiv = document.getElementById("products");
  productsDiv.innerHTML = ""; // Clear the products display
  // Iterate through filtered products and create elements for each
  filteredProducts.forEach((product) => {
    // Create the product item element
    const productItem = $(`
    <div class="product-item" draggable="true" id="${product.nr}">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-price">${product.price} kr</p>
        ${product.alcoholstrength
        ? `<p class="product-alcohol">${product.alcoholstrength}</p>`
        : ""
      }
        ${product.category
        ? `<p class="product-category">${product.category}</p>`
        : ""
      }
        ${product.packaging
        ? `<p class="packaging">${product.packaging}</p>`
        : ""
      }
        ${product.productionyear
        ? `<p class="product-year">${product.productionyear}</p>`
        : ""
      }
        ${product.producer
        ? `<p class="product-producer">${product.producer}</p>`
        : ""
      }
        ${product.countryoforiginlandname
        ? `<p>${product.countryoforiginlandname}</p>`
        : ""
      }
    </div>
`);
    // Bind the click event to this specific product item
    productItem.on("click", () => {
      addToCart(product.nr, product.name, product.price);
    });

    // Bind the dragstart event to this specific product item for drag and drop
    productItem.on("dragstart", (e) => {
      // Use the product's nr (number) as identifier
      e.originalEvent.dataTransfer.setData("text", product.nr);
    });

    $("body").on("dragstart", ".cart-item", function (e) {
      const itemNr = $(this).data("nr");
      e.originalEvent.dataTransfer.setData("text", itemNr);
    });

    // Append the product item to the products container
    $("#products").append(productItem);
  });
}

// return the list of prodcuts filtered based on type
function filterByType(typeName) {
  let filteredProducts;
  // Filter products based on the selected category
  if (typeName == "All") {
    filteredProducts = DB.products;
  } else {
    filteredProducts = DB.products.filter(
      (product) => product.type == typeName
    );
  }
  showMenu(filteredProducts);
}

// return the list of products filtered based on gluten and tannin
function filterByAllergic(type) {
  let filteredProducts;
  let isGlutenFreeChecked = document.getElementById("gluten").checked;
  let isTanninFreeChecked = document.getElementById("tannin").checked;

  if (
    document.getElementById("gluten").checked &&
    document.getElementById("tannin").checked
  ) {
    type = "both";
  }

  if (type == "gluten") {
    //  // Check the states of the gluten free and tannin free checkboxes
    // Filter products based on the selected criteria
    filteredProducts = DB.products.filter((product) => {
      const meetsGlutenFree = isGlutenFreeChecked ? product.gluten == 0 : true;
      // Return true if the product meets both conditions
      return meetsGlutenFree;
    });
  } else if (type == "tannin") {
    //  // Check the states of the gluten free and tannin free checkboxes

    // Filter products based on the selected criteria
    filteredProducts = DB.products.filter((product) => {
      const meetsTanninFree = isTanninFreeChecked ? product.tannin == 0 : true;

      // Return true if the product meets both conditions
      return meetsTanninFree;
    });
  } else {
    filteredProducts = DB.products.filter((product) => {
      const meetsBoth =
        isGlutenFreeChecked && isTanninFreeChecked
          ? product.gluten == 0 && product.tannin == 0
          : true;
      // Return true if the product meets both conditions
      return meetsBoth;
    });
  }
  showMenu(filteredProducts);
}

// return the list of products filtered based on search
function filterBySearch() {
  const searchInput = document.getElementById("search-bar").value.toLowerCase();

  const filteredProducts = DB.products.filter((product) => {
    return product.name.toLocaleLowerCase().includes(searchInput);
  });

  showMenu(filteredProducts);
}

// return the list of products filtered based on different sort
function filterBySort() {
  const sortBy = document.getElementById("sortby").value;
  let sortedProducts;

  switch (sortBy) {
    case "price_low_high":
      sortedProducts = DB.products.sort((a, b) => a.price - b.price);
      break;
    case "price_high_low":
      sortedProducts = DB.products.sort((a, b) => b.price - a.price);
      break;
    case "alcohol_low_high":
      sortedProducts = DB.products.sort((a, b) => {
        const alcoholA = parseFloat(a.alcoholstrength.replace("%", ""));
        const alcoholB = parseFloat(b.alcoholstrength.replace("%", ""));
        return alcoholA - alcoholB;
      });
      break;
    case "alcohol_high_low":
      sortedProducts = DB.products.sort((a, b) => {
        const alcoholA = parseFloat(a.alcoholstrength.replace("%", ""));
        const alcoholB = parseFloat(b.alcoholstrength.replace("%", ""));
        return alcoholB - alcoholA;
      });
      break;

    default:
      sortedProducts = DB.products;
      break;
  }
  showMenu(sortedProducts);
}

function fetchMenu() {
  returnFilterButtons();
  filterByType("All");
  $("#menu-container").show();
}

function getOrderNumber() {
  let orderNumber = localStorage.getItem("orderNumber");

  if (!orderNumber) {
    orderNumber = "001";
  } else {
    let nextOrderNumber = parseInt(orderNumber) + 1;
    orderNumber = nextOrderNumber.toString().padStart(3, "0");
  }

  // Update and store the order number in localStorage
  localStorage.setItem("orderNumber", orderNumber);
  return orderNumber;
}

// Function to add a product to the shopping cart
function addToCart(nr, name, price) {
  const itemIndex = cart.findIndex((item) => item.nr === nr);

  if (itemIndex > -1) {
    cart[itemIndex].quantity += 1; // If the item exists in the cart, increase its quantity
  } else {
    cart.push({ nr, name, price, quantity: 1 }); // If the item is not in the cart, add it as a new item
  }

  // Update the cart UI to reflect the changes
  updateCartUI();
}

// Function to update the shopping cart UI
function updateCartUI() {
  const cartContainer = $("#cart-container");
  cartContainer.empty();
  cartContainer.append(`<div class="order-title">Order Summary</div>
  <hr class="hr-style"> </hr>`);
  if (cart.length == 0) {
    cartContainer.append(
      `<div class="empty-text">
      <p>Your cart is empty!</p>
      <p>You can add products by clicking on them or dragging them to the cart.</p>
      </div>`
    );
  } else {
    // Iterate through items in the cart and create list items for each
    cart.forEach((item) => {
      cartContainer.append(`
      <li class="cart-item" draggable="true" data-nr="${item.nr}">
      ${item.quantity}x ${item.name}
      <p class="item-price"> ${item.price}SEK </p>
      <span class="material-icons remove-icon" data-nr="${item.nr}">cancel</span>
      </li>
      `);
    });
    // append the checkout options
    cartContainer.append(`
    <div class="bottom-section">
    <div class="service-options">
      <label>
        <input type="radio" name="service" value="table" checked> Table Service
      </label>
      <label>
        <input type="radio" name="service" value="bar"> Bar Pick-Up
      </label>
      <label>
        <input type="radio" name="service" value="fridge"> Fridge Self-Service
        <span class="combination">Combination: 35-16-08</span>
      </label>
    </div>
    
    <div class="total-section">
      <span>TOTAL</span>
      <span class="total-price">${updateTotalPrice()}</span>
    </div>
    
    <div class="payment-options">
      <label>
        <input type="radio" name="payment" value="full"> Pay in Full
      </label>
      <label>
        <input type="radio" name="payment" value="split"> Split Bill
        <input type="text" class="split-amount">
      </label>
    </div>
    

    <div class="amount-due">
      <span>AMOUNT DUE</span>
      <span class="due-price"></span>
    </div>
    
    <button type="button" id="place-order" class="secondary-btn">PLACE ORDER</button>
    </div>
  `);

    manageAmountDue();
    updateAmountDue();
    // Update the total price in the UI
    updateTotalPrice();
    updateTotalPriceDisplay();
  }
}

function manageAmountDue() {
  // Select the radio buttons and the "amount-due" section
  var paymentOptions = document.querySelectorAll('input[name="payment"]');
  var amountDueSection = document.querySelector(".amount-due");

  // Add event listener to the radio buttons
  paymentOptions.forEach(function (radio) {
    radio.addEventListener("change", function () {
      // Check the value of the selected radio button
      if (this.value === "split") {
        // If the value is "split", show the "amount-due" section
        amountDueSection.style.display = "block";
      } else {
        // Otherwise, hide it
        amountDueSection.style.display = "none";
      }
    });
  });

  // Initially hide the "amount-due" section
  amountDueSection.style.display = "none";
}

function updateAmountDue() {
  const numberOfPeople = parseFloat($('.split-amount').val());
  const totalAmount = updateTotalPrice(); // Ensure this function returns the current total price of the cart

  // Validate the input to make sure it is a number and greater than 0
  if (!isNaN(numberOfPeople) && numberOfPeople > 0) {
    const dueAmountPerPerson = totalAmount / numberOfPeople;
    // Update the UI to display the due amount per person
    $('.due-price').text(`${dueAmountPerPerson.toFixed(2)} SEK per person`);
  } else {
    // If the input is invalid, you can reset the displayed due amount or show an error message
    $('.due-price').text(`Invalid input`);
  }
}

// Function to update the total price in the UI
function updateTotalPrice() {
  return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
}

function updateTotalPriceDisplay() {
  const totalPriceElement = document.querySelector(".total-price");
  if (totalPriceElement) {
    totalPriceElement.textContent = `${updateTotalPrice()} SEK`;
  }
}

// Function to remove a product from the shopping cart
function removeFromCart(nr) {
  const itemIndex = cart.findIndex((item) => item.nr == nr);

  if (itemIndex > -1) {
    if (cart[itemIndex].quantity > 1) {
      cart[itemIndex].quantity -= 1; // Decrease the item's quantity by 1 if more than 1
    } else {
      cart.splice(itemIndex, 1); // Remove the item from the cart if quantity is 1
    }
    updateCartUI(); // Update the cart UI to reflect the changes
  }
}

function fetchCart() {
  updateCartUI();
}

function callEventListeners() {
  // Event listener for gluten checkbox changes
  $("#gluten").on("change", function () {
    filterByAllergic("gluten");
  });

  // Event listener for tannin checkbox changes
  $("#tannin").on("change", function () {
    filterByAllergic("tannin");
  });

  $("#search-bar").on("input", function () {
    filterBySearch();
  });

  $("#sortby").on("change", function () {
    filterBySort();
  });

  $("#cart-container").on("click", ".remove-icon", function () {
    const itemNr = $(this).data("nr");
    removeFromCart(itemNr);
  });

  // For drag over
  $("#cart-container").on("dragover", function (e) {
    e.preventDefault(); // This allows us to drop.
  });

  // For drop
  $("#cart-container").on("drop", function (e) {
    e.preventDefault(); // Prevent default action (open as link for some elements)

    // Get the id of the product being dragged
    const productId = e.originalEvent.dataTransfer.getData("text");

    // Find the product in DB.products by its nr (number)
    const productToAdd = DB.products.find(
      (product) => product.nr === productId
    );

    // Call addToCart function if product is found
    if (productToAdd) {
      addToCart(productToAdd.nr, productToAdd.name, productToAdd.price);
    }
  });

  // For drag over from cart
  $("#products").on("dragover", function (e) {
    e.preventDefault(); // Allow drop
  });

  $("#products").on("drop", function (e) {
    e.preventDefault();
    const itemNr = e.originalEvent.dataTransfer.getData("text");
    removeFromCart(itemNr);
  });

  $(".split-amount").on("input", updateAmountDue);
}
