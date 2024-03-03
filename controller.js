import { DB } from "./model.js";

// global variables
let cart = [];
let role = "";
let userFullName = "";
let currentFilters = {
  type: "All",
  search: "",
  sort: "default",
  isGlutenFree: false,
  isTanninFree: false,
  isOrganic: false,
  isKosher: false,
};

$(document).ready(function () {
  renderApp();
  showLandingPage();
  callEventListeners();
  checkAuthentication();
  updateWelcomeText();
});

// function to render the app at the beggining
function renderApp() {
  fetchMenu();
  fetchCart();
}

// ******Functions******
// landing page
function showLandingPage() {
  $("#landing").hide();
  $("#landing").append(
    `
    <div class="landing-container">
    <div class="landing-text">
      <p class="welcome">Welcome to the </p>
      <p class="pub-name">Flying Dutchman</p>
      <img src="assets/images/logo.png" alt="pub" class="pub-image">
      <button type="button" class="primary-btn" id="enter-pub">MENU</button>
    </div>
  </div>
    `
  );
  $("#landing").show();
  $("#app").hide();
}

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
    <img src="assets/images/game-icons--${product.type === "Wine"
        ? "beer-bottle"
        : product.type === "Beer"
          ? "wine-glass"
          : "martini"
      }.svg" alt="${product.name}" class="product-image">
<div class="product-info">
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

function fetchMenu() {
  returnFilterButtons();
  filterByType("All");
  $("#menu-container").show();
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
      ${role == 3
        ? `
            <label>
              <input type="radio" name="service" value="fridge"> Fridge Self-Service
              <p class="combination">Combination: 35-16-08</p>
            </label>
      `
        : ""
      }
    </div>
    <div class="table-number">
    <label>
    <label>Table Number:</label>
    <input type="text" id="table-number">  </label>
   
    </div>
    <div class="total-section">
      <span>TOTAL</span>
      <span class="total-price">${updateTotalPriceDisplay()}</span>
    </div>
    
    <div class="cart-buttons">
    ${role == 3
        ? '<button type="button" id="submit-vip" class="secondary-btn">Place Order</button>'
        : '<button type="button" id="place-order" class="secondary-btn">Place Order</button>'
      }
    <button type="button" id="clear-cart" class="red-btn">Clear Cart</button>
    </div>
    </div>
  `);

    $("#clear-cart").on("click", function () {
      clearCart();
    });

    $("#submit-vip").on("click", function () {
      openPayment();
    });

    $("#place-order").on("click", function () {
      placeOrder();
    });

    // manageAmountDue();
    // updateAmountDue();
    // Update the total price in the UI
    updateTotalPrice();
    updateTotalPriceDisplay();
  }
}

// function manageAmountDue() {
//   // Select the radio buttons and the "amount-due" section
//   var paymentOptions = document.querySelectorAll('input[name="payment"]');
//   var amountDueSection = document.querySelector(".amount-due");

//   // Add event listener to the radio buttons
//   paymentOptions.forEach(function (radio) {
//     radio.addEventListener("change", function () {
//       // Check the value of the selected radio button
//       if (this.value === "split") {
//         // If the value is "split", show the "amount-due" section
//         amountDueSection.style.display = "block";
//       } else {
//         // Otherwise, hide it
//         amountDueSection.style.display = "none";
//       }
//     });
//   });

//   // Initially hide the "amount-due" section
//   amountDueSection.style.display = "none";
// }

// function updateAmountDue() {
//   const numberOfPeople = parseFloat($('.split-amount').val());
//   const totalAmount = updateTotalPrice(); // Ensure this function returns the current total price of the cart

//   // Validate the input to make sure it is a number and greater than 0
//   if (!isNaN(numberOfPeople) && numberOfPeople > 0) {
//     const dueAmountPerPerson = totalAmount / numberOfPeople;
//     // Update the UI to display the due amount per person
//     $('.due-price').text(`${dueAmountPerPerson.toFixed(2)} SEK per person`);
//   } else {
//     // If the input is invalid, you can reset the displayed due amount or show an error message
//     $('.due-price').text(`Invalid input`);
//   }
// }

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

// order
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

// Function to place an order
function placeOrder() {
  if (cart.length > 0) {
    const orderNumber = getOrderNumber();
    DB.orders.push({
      order_nr: orderNumber,
      user_id: localStorage.getItem("userId")
        ? localStorage.getItem("userId")
        : "",
      table_number: $("#table-number").val(),
      items: cart,
      amount: updateTotalPrice(),
      pickup: $("input[name='service']:checked").val(),
    });
    alert(`Order placed successfully. Your order number is ${orderNumber}`);
    clearCart();
  } else {
    alert(
      "Cart is empty. Please add items to your cart before placing an order."
    );
  }
}

function openPayment() {
  $("#payment-modal").empty(); // Clear the modal content first
  $("#payment-modal").append(
    `<form class="modal-content" id="payment-form">
    <label for="card-number">Card Number</label>
    <input type="text" id="card-number" placeholder="Enter Card Number" name="card-number" required>

    <label for="cvv">CVV</label>
    <input type="text" id="cvv" placeholder="Enter CVV" name="cvv" required>

    <label for="expiry-date">Expiry Date</label>
    <input type="text" id="expiry-date" placeholder="Enter Expiry Date" name="expiry-date" required>

    <button type="submit" class="secondary-btn">Pay</button>
  </form>`
  );
  $("#payment-modal").show(); // Show the modal

  // Attach the event listener here, after the form is created
  $("#payment-form").on("submit", function (e) {
    e.preventDefault(); // Prevent the default form submit action
    placeOrder();
    $("#payment-modal").hide();
  });
}
// Function to clear the shopping cart
function clearCart() {
  cart = [];
  updateCartUI();
}

// LOGIN
function openLogin() {
  $("#login-modal").empty(); // Clear the modal content first
  $("#login-modal").append(
    `<form class="modal-content" id="login-form"> 
    <label for="uname">Username</label>
    <input type="text" id="username" placeholder="Enter Username" name="username" required>

    <label for="psw">Password</label>
    <input type="password" id="password" placeholder="Enter Password" name="password" required>

    <button type="submit" class="secondary-btn">Login</button>
  </form>`
  );
  $("#login-modal").show(); // Show the modal

  // Attach the event listener here, after the form is created
  $("#login-form").on("submit", function (e) {
    e.preventDefault(); // Prevent the default form submit action
    login();
  });
}

function login() {
  const username = $("#username").val();
  const password = $("#password").val();

  if (validateUser(username, password)) {
    var user = DB.users.find(
      (user) => user.username === username && user.password === password
    );
    $("#login-modal-container").hide();
    localStorage.setItem("username", username);
    localStorage.setItem("role", user.credentials);
    localStorage.setItem("userId", user.user_id);
    localStorage.setItem(
      "userFullName",
      user.first_name + " " + user.last_name
    );
    $(".login-btn").hide();
    $(".logout-btn").show();
    updateWelcomeText();
  } else {
    alert("Invalid username or password. Please try again.");
  }
}

function logout() {
  localStorage.removeItem("username");
  localStorage.removeItem("userFullName");
  localStorage.removeItem("role");
  localStorage.removeItem("userId");
  $(".login-btn").show();
  $(".logout-btn").hide();
  updateWelcomeText();
}

function validateUser(username, password) {
  for (var i = 0; i < DB.users.length; i++) {
    if (DB.users[i].username == username) {
      if (DB.users[i].password == password) {
        return true;
      } else {
        return false;
      }
    }
  }
  return false;
}

function checkAuthentication() {
  if (localStorage.getItem("username")) {
    role = localStorage.getItem("role");
    // $("#welcome-container").append(`
    //     <p>Welcome to Flying Dutchman Pub ${
    //       localStorage.getItem("userFullName")
    //         ? localStorage.getItem("userFullName")
    //         : ""
    //     }!</p>
    //     <p> Enjoy our wide range of drinks and have a great time!</p>`);
    $(".login-btn").hide();
    $(".logout-btn").show();
  } else {
    $(".login-btn").show();
    $(".logout-btn").hide();
  }
}

function updateWelcomeText() {
  $("#welcome-container").empty();
  $("#welcome-container").append(`
      <p>Welcome to Flying Dutchman Pub ${localStorage.getItem("userFullName")
      ? localStorage.getItem("userFullName")
      : ""
    }!</p>
      <p> Enjoy our wide range of drinks and have a great time!</p>`);
}

function applyFilters() {
  let filteredProducts = DB.products;

  // Filter by type
  if (currentFilters.type !== "All") {
    filteredProducts = filteredProducts.filter(
      (product) => product.type === currentFilters.type
    );
  }

  // Filter by search terms
  if (currentFilters.search) {
    filteredProducts = filteredProducts.filter((product) =>
      product.name.toLowerCase().includes(currentFilters.search.toLowerCase())
    );
  }

  // Applied Allergen Filtration
  if (currentFilters.isGlutenFree) {
    filteredProducts = filteredProducts.filter(
      (product) => product.gluten == 0
    );
  }
  if (currentFilters.isTanninFree) {
    filteredProducts = filteredProducts.filter(
      (product) => product.tannin == 0
    );
  }
  if (currentFilters.isOrganic) {
    filteredProducts = filteredProducts.filter(
      (product) => product.organic == 1
    );
  }
  if (currentFilters.isKosher) {
    filteredProducts = filteredProducts.filter(
      (product) => product.kosher == 1
    );
  }

  // Applying Sorting Logic
  switch (currentFilters.sort) {
    case "price_low_high":
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case "price_high_low":
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case "alcohol_low_high":
      filteredProducts.sort((a, b) => {
        const alcoholA = parseFloat(a.alcoholstrength) || 0;
        const alcoholB = parseFloat(b.alcoholstrength) || 0;
        return alcoholA - alcoholB;
      });
      break;
    case "alcohol_high_low":
      filteredProducts.sort((a, b) => {
        const alcoholA = parseFloat(a.alcoholstrength) || 0;
        const alcoholB = parseFloat(b.alcoholstrength) || 0;
        return alcoholB - alcoholA;
      });
      break;
    default:
      // Not sorted by default
      break;
  }

  // Show filtered and sorted product list
  showMenu(filteredProducts);
}

function callEventListeners() {
  $("#enter-pub").on("click", function () {
    $("#landing").hide();
    $("#app").show();
  });
  $(".login-btn").on("click", function () {
    openLogin();
  });

  $(".logout-btn").on("click", function () {
    logout();
  });

  $(".filter-buttons .secondary-btn").on("click", function () {
    currentFilters.type = $(this).text();
    applyFilters();
  });

  // Event listener for checkbox changes
  $("#gluten").on("change", function () {
    currentFilters.isGlutenFree = this.checked;
    applyFilters();
  });

  $("#tannin").on("change", function () {
    currentFilters.isTanninFree = this.checked;
    applyFilters();
  });

  $("#organic").on("change", function () {
    currentFilters.isOrganic = this.checked;
    applyFilters();
  });

  $("#kosher").on("change", function () {
    currentFilters.isKosher = this.checked;
    applyFilters();
  });

  $("#search-bar").on("input", function () {
    currentFilters.search = $(this).val();
    applyFilters();
  });

  $("#sortby").on("change", function () {
    currentFilters.sort = $(this).val();
    applyFilters();
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

  // $(".split-amount").on("input", updateAmountDue);
}
