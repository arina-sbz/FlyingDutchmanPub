// imports the DB object from model.js
import { DB } from "./model.js";

// global variables
let cart = [];
let role = "";
let currentSystem = "";
let orders = [];
let currentFilters = {
  type: "All",
  search: "",
  sort: "default",
  isGlutenFree: false,
  isTanninFree: false,
  isOrganic: false,
  isKosher: false,
};

// Functions to call when the DOM is fully loaded
$(document).ready(function () {
  showLandingPage();
  callEventListeners();
  checkAuthentication();
  updateWelcomeText();
  setOrdersInStorage();
  updateServiceOptions();
  // Listens for changes on service input fields and calls toggleTableNumberInput function
  $(document).on("change", "input[name='service']", function () {
    toggleTableNumberInput();
  });
});

// function for showing landing page
function showLandingPage() {
  $("#landing").hide();
  // append the elements of landing page
  $("#landing").append(
    `
    <div class="landing-container">
    <div class="landing-elements">
      <p class="welcome">Welcome to the </p>
      <p class="pub-name">Flying Dutchman</p>
      <img src="assets/images/logo.png" alt="pub" class="pub-image">
      <div class="landing-btns">
      <button type="button" class="primary-btn landing-btn" id="enter-pub">Customer</button>
      <button type="button" class="primary-btn landing-btn" id="choose-staff">Staff</button>
      </div>
      </div>
  </div>
    `
  );
  // show landing div after appending its elements
  $("#landing").show();
  // hide the app div
  $("#app").hide();
}

// function to show filter buttons
function returnFilterButtons() {
  // defining the title for filter buttons
  var categories = ["All", "Beer", "Wine", "Spirit"];
  // appending the filter buttons to the filter section
  categories.forEach((category) => {
    $(".filter-buttons").append(
      `<button type="button" class="secondary-btn">${category}</button>`
    );
    // event listener for filter buttons (call filterByType function)
    $(".filter-buttons .secondary-btn").on("click", function () {
      const categoryName = $(this).text();
      filterByType(categoryName);
    });
  });
}

// show the list of filtered products
function showMenu(filteredProducts) {
  const productsDiv = $(".products");
  productsDiv.empty();
  // If no products are found, display a message
  if (filteredProducts.length === 0) {
    productsDiv.innerHTML = `<p class="no-products">No products found</p>`;
  }
  // Iterate through filtered products and create elements for each of them
  filteredProducts.forEach((product) => {
    // create the product item element
    const productItem = $(`
    <div class="product-item" draggable="true" id="${product.nr}">
        <div class="flex-container">
            <img src="assets/images/game-icons--${
              product.type === "Wine"
                ? "wine-glass"
                : product.type === "Beer"
                ? "beer-bottle"
                : "martini"
            }.svg" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">${product.price} kr</p>
            </div>
        </div>
        <div class="divider"></div> 
        <div class="bottom-info">
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

        ${
          currentSystem == "staff"
            ? `
            <div class="divider"></div>
            <div class="product-actions">
                <span class="${product.stock > 5 ? "" : "low-stock"}">Stock: ${
                product.stock ? `<span>${product.stock}</span>` : ""
              }</span>
                <button type="button">Edit</button>
                <button type="button">Remove</button>
            </div>
        `
            : ``
        }

    </div>
`);

    // Bind the click event to this specific product item (to be added to the cart)
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
    $(".products").append(productItem);
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

// function to call to show filter buttons and then call filterByType("All") to show all products
function showFilters() {
  returnFilterButtons();
  filterByType("All");
}

// Function to add a product to the shopping cart
function addToCart(nr, name, price) {
  // Find the index of the item in the cart
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
  const cartContainer = $(".cart-container");
  cartContainer.empty();
  cartContainer.append(`<div class="order-title">Order Summary</div>
  <hr class="hr-style"> </hr>`);
  // If the cart is empty, display a message
  if (cart.length == 0) {
    cartContainer.append(
      `<div class="empty-text">
      <p>Your cart is empty!</p>
      <p>You can add products by clicking on them or dragging them to the cart.</p>
      </div>`
    );
  } else {
    // Iterate through items in the cart and create list items for each
    cartContainer.append(`<ul class="cart-items"></ul>`);
    cart.forEach((item) => {
      $(".cart-items").append(`
      <li class="cart-item" draggable="true" data-nr="${item.nr}">
      ${item.quantity}x ${item.name}
      <p class="item-price"> ${item.price}SEK </p>
      <span class="material-icons remove-icon" data-nr="${item.nr}">cancel</span>
      </li>
      `);
    });
    // append the service options (table, bar or fridge), total amount, and buttons
    cartContainer.append(`
    <div class="bottom-section">
    <div class="service-options">
      <label>
      <input type="radio" name="service" value="table"> Table Service
      </label>
      <label>
      <input type="radio" name="service" value="bar"> Bar Pick-Up
      </label>
    </div>
    <div class="table-number" style="display: none;">
    <label for="table-number">Table Number:</label>
    <input type="text" id="table-number" name="table-number">
    </div>

    <div class="total-section">
      <span>TOTAL</span>
      <span class="total-price">${updateTotalPriceDisplay()}</span>
    </div>
    
    <div class="cart-buttons">
    ${
      localStorage.getItem("role") == 3
        ? '<button type="button" id="submit-vip" class="secondary-btn">Place Order</button>'
        : '<button type="button" id="place-order" class="secondary-btn">Place Order</button>'
    }
    <button type="button" id="clear-cart" class="red-btn">Clear Cart</button>
    </div>
    </div>
    `);

    // Event listener for clear-cart button
    $("#clear-cart").on("click", function () {
      clearCart();
    });

    // Event listener for submit-vip button
    $("#submit-vip").on("click", function () {
      openPayment();
    });

    // Event listener for place-order button
    $("#place-order").on("click", function () {
      placeOrder();
    });

    // functions to call when the cart is updated
    // update the service options
    updateServiceOptions();
    // update the total amount
    updateTotalPrice();
    // update the display of total amount
    updateTotalPriceDisplay();
  }
}

// Function to toggle the table number input based on the selected service option
function toggleTableNumberInput() {
  // if the selected service was table, show the table number input
  if ($("input[name='service']:checked").val() === "table") {
    $(".table-number").show();
  } else {
    $(".table-number").hide();
  }
}

// Function to update the total amount of the order
function updateTotalPrice() {
  return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
}

// Function to update the total amount display
function updateTotalPriceDisplay() {
  const totalPriceElement = document.querySelector(".total-price");
  if (totalPriceElement) {
    totalPriceElement.textContent = `${updateTotalPrice()} SEK`;
  }
}

// Function to remove a product from the cart
function removeFromCart(nr) {
  // Find the index of the item in the cart
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

// Function to get the order number
function getOrderNumber() {
  // Get the current order number from localStorage
  let orderNumber = localStorage.getItem("orderNumber");
  // If there is no order number in localStorage, set it to 003 (there are already two items in the DB)
  if (!orderNumber) {
    orderNumber = "003";
  } else {
    // If there is an order number in localStorage, increment it by 1
    let nextOrderNumber = parseInt(orderNumber) + 1;
    // Pad the order number with leading zeros to make it 3 digits long
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
    // Add the order to the orders array in localStorage
    orders.push({
      order_nr: orderNumber,
      username:
        localStorage.getItem("role") == "3" &&
        localStorage.getItem("userFullName")
          ? localStorage.getItem("userFullName")
          : "",
      table_number: $("#table-number").val() ? $("#table-number").val() : "",
      items: cart,
      amount: updateTotalPrice(),
      type: $("input[name='service']:checked").val(),
      status: "pending",
    });
    // Store the updated orders array in localStorage
    localStorage.setItem("orders", JSON.stringify(orders));
    // Show an alert with the order number and the fridge code (if the service is fridge)
    const randomNumber = Math.floor(Math.random() * 1000);
    $("input[name='service']:checked").val() === "fridge"
      ? alert(
          `Order placed successfully. Your order number is ${orderNumber}. The fridge code is ${randomNumber}`
        )
      : alert(`Order placed successfully. Your order number is ${orderNumber}`);

    // Clear the cart after placing the order
    clearCart();
  } else {
    // If the cart is empty, show an alert
    alert(
      "Cart is empty. Please add items to your cart before placing an order."
    );
  }
}

// Function to get the orders from DB and set it in localStorage
function setOrdersInStorage() {
  orders = DB.orders;
  if (!localStorage.getItem("orders")) {
    localStorage.setItem("orders", JSON.stringify(orders));
  }
}

// Function to open the payment modal
function openPayment() {
  $("#payment-modal").empty(); // Clear the modal content first
  // Append the form to the modal
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

  // Attach the submit event listener here
  $("#payment-form").on("submit", function (e) {
    e.preventDefault(); // Prevent the default form submit action
    // Call the placeOrder function when the form is submitted
    placeOrder();
    $("#payment-modal").hide();
  });
}

// Function to clear the cart
function clearCart() {
  cart = [];
  updateCartUI();
}

// Function to open the login modal
function openLogin() {
  $("#login-modal").empty(); // Clear the modal content first
  // Append the form to the modal
  $("#login-modal").append(
    `<form class="modal-content" id="login-form"> 
    <label for="uname">Username</label>
    <input type="text" id="username" placeholder="Enter Username" name="username" required>

    <label for="psw">Password</label>
    <input type="password" id="password" placeholder="Enter Password" name="password" required>

    <button type="submit" class="secondary-btn">Login</button>
  </form>`
  );
  $("#login-modal").show();

  // Attach the submit event listener
  $("#login-form").on("submit", function (e) {
    e.preventDefault(); // Prevent the default form submit action
    // Call the login function when the form is submitted
    login();
  });
}

// Function to login
function login() {
  // Get the username and password from the form
  const username = $("#username").val();
  const password = $("#password").val();
  // if the username and password are valid, hide the login modal and show the main page
  if (validateUser(username, password)) {
    // Get the user from the DB
    var user = DB.users.find(
      (user) => user.username === username && user.password === password
    );
    $("#login-modal-container").hide();
    // Set the user details in localStorage
    localStorage.setItem("username", username);
    localStorage.setItem("role", user.credentials);
    localStorage.setItem("userId", user.user_id);
    localStorage.setItem(
      "userFullName",
      user.first_name + " " + user.last_name
    );
    // show staff elements if the currentSystem is set to staff
    if (currentSystem == "staff") {
      showStaffMain();
      updateWelcomeText();
    }
    // if the currentSystem is customer
    else {
      $(".login-btn").hide();
      $(".logout-btn").show();
      updateWelcomeText();
      updateServiceOptions();
      updateCartUI();
    }
  } else {
    alert("Invalid username or password. Please try again.");
  }
}

// Function to logout
function logout() {
  // Clear the user details from localStorage
  localStorage.removeItem("username");
  localStorage.removeItem("role");
  localStorage.removeItem("userId");
  localStorage.removeItem("userFullName");
  clearCart();
  // Show the landing page
  window.location.href = "index.html";
  $("#landing").show();
}

// Function to validate the user
function validateUser(username, password) {
  // Check if the username and password are valid
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

// Function to call based on the role (vip or staff)
function checkAuthentication() {
  if (localStorage.getItem("role") == "3") {
    role = localStorage.getItem("role");
    updateServiceOptions();
    $(".login-btn").hide();
    $(".logout-btn").show();
  } else {
    $(".login-btn").show();
    $(".logout-btn").hide();
  }
}

// Function to update the service options
function updateServiceOptions() {
  const role = localStorage.getItem("role");
  // If the user is a vip customer, show the fridge service option
  if (role === "3") {
    $(".service-options").append(`
      <label>
        <input type="radio" name="service" value="fridge"> Fridge Self-Service
      </label>
    `);
  } else {
    $('input[name="service"][value="fridge"]').closest("label").remove();
  }
}

// Function to update the welcome text based on the role
function updateWelcomeText() {
  let position = "";
  // Set the position based on the role
  localStorage.getItem("role") == "0"
    ? (position = "Manager")
    : localStorage.getItem("role") == "1"
    ? (position = "Bartender")
    : (position = "Waiter");
  $("#welcome-container").empty();
  // Append the welcome text based on the role
  if (localStorage.getItem("currentSystem") == "customer") {
    $("#welcome-container").append(
      `<p>Welcome to Flying Dutchman Pub ${
        localStorage.getItem("role") == "3"
          ? localStorage.getItem("userFullName")
          : "" || ""
      }!</p>` +
        (localStorage.getItem("currentSystem") == "customer"
          ? "<p> Enjoy our wide range of drinks and have a great time!</p>"
          : "")
    );
  } else {
    $("#welcome-container").append(
      `<p>${localStorage.getItem("userFullName")} - ${position}</p>`
    );
  }
}

// Function to apply filters
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

// Function to call when staff button on landing page is clicked
function staffIsChosen() {
  // Set the currentSystem to staff and store it in localStorage
  currentSystem = "staff";
  localStorage.setItem("currentSystem", "staff");
  // show and hide necessary elements
  $("#landing").hide();
  $("#menu-container").hide();
  $(".login-btn").hide();
  $(".logout-btn").hide();
  $("#welcome-container").hide();
  $("#staff-container").hide();
  $("#filter-section").hide();
  $("#app").show();
  // if the staff members is already logged in, call showStaffMain and if they are not logged in, open the login modal
  if (localStorage.getItem("role") && localStorage.getItem("role") != "3") {
    showStaffMain();
  } else {
    openLogin();
  }
}

// Function to call to show the staff main elements
function showStaffMain() {
  showFilters();
  // show and hide necessary elements
  $("#staff-container").show();
  $("#filter-section").show();
  $("#welcome-container").show();
  $(".logout-btn").show();
  // show low stock and alert security button
  $(".staff-alert").append(
    `
      <p>
      <i class="fas fa-exclamation-circle"></i>
      Low Stock: 5 items
      </p>
      <button class="alert-security">
      <i class="fas fa-shield-alt"></i>
      Alert Security
      </button>
    `
  );
  // show the orders list
  updateOrdersList();
}

// Function to update the orders list
function updateOrdersList() {
  // Get the orders list from localStorage
  const ordersList = JSON.parse(localStorage.getItem("orders") || []);
  // Show the orders list
  const ordersListContainer = $(".orders-container");
  ordersListContainer.empty();
  ordersListContainer.append(`<div class="order-title">Orders List</div>
  <hr class="hr-style"> </hr>`);
  //  If no orders are found, display a message
  if (ordersList.length == 0) {
    ordersListContainer.append(
      `<div class="empty-text">
      <p>No current orders to handle. Enjoy the break, and stay ready for when the next order comes in!
      </p>
      </div>`
    );
  } else {
    // Sort the orders list based on the status (pending at the top of the list)
    ordersList.sort((a, b) => {
      if (a.status === "pending" && b.status !== "pending") {
        return -1;
      } else if (a.status !== "pending" && b.status === "pending") {
        return 1;
      } else if (a.status === "fulfilled" && b.status !== "fulfilled") {
        return 1;
      } else if (a.status !== "fulfilled" && b.status === "fulfilled") {
        return -1;
      } else {
        return 0;
      }
    });

    // Iterate through the orders list and create elements for each of them
    ordersList.forEach((item) => {
      // define class based on order's status
      if (item.amount > 0) {
        let statusClass;
        let statusIcon;
        switch (item.status) {
          case "fullfilled":
            statusClass = "order-fullfilled";
            statusIcon = '<i class="fas fa-check-circle"></i>';
            break;
          default:
            statusClass = "order-pending";
            statusIcon = '<i class="fas fa-hourglass-half"></i>';
        }
        // Append the order item to the orders list container
        ordersListContainer.append(`
      <div class="order-item ${statusClass}" data-order_nr="${item.order_nr}">
      <h4 class="order-type">${
        item.type === "table"
          ? `Table ${item.table_number}`
          : item.type === "bar"
          ? "Bar"
          : "Fridge"
      }
      <p class="order-number"> #${item.order_nr} </p>
      </h4>
      <span class="order-status ${statusClass}">${statusIcon} ${
          item.status
        } </span>
      <span class="order-amount">${item.amount} SEK</span>
      </div>
      `);
      }
    });
  }
}

// Function to remove an item from an order
function removeItemFromOrder(orderNr, itemNr) {
  // Get the orders list from localStorage
  const ordersList = JSON.parse(localStorage.getItem("orders") || []);
  // Find the order and the item in the order
  const order = ordersList.find((order) => order.order_nr === orderNr);
  if (order) {
    // Find the item in the order
    const item = order.items.find((item) => item.nr == itemNr);
    // If the item is found and its quantity is more than 1 decrease its quantity by 1, else remove it from the order
    if (item) {
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        const itemIndex = order.items.findIndex((item) => item.nr == itemNr);
        if (itemIndex !== -1) {
          order.items.splice(itemIndex, 1);
        }
      }
      const orderIndex = ordersList.findIndex(
        (order) => order.order_nr === orderNr
      );
      // Update the order's amount
      const totalPrice = order.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      order.amount = totalPrice;
      // Update the order in the orders list
      if (orderIndex !== -1) {
        ordersList[orderIndex] = order;
        localStorage.setItem("orders", JSON.stringify(ordersList));
        $("#order-modal").hide();
        updateOrdersList();
      }
    }
  }
}

// Function to view an order item in the modal
function viewOrderItem(orderNr) {
  // Get the orders list from localStorage
  const ordersList = JSON.parse(localStorage.getItem("orders") || []);
  // Find the order in the orders list
  const order = ordersList.find((order) => order.order_nr === orderNr);
  if (order) {
    $("#order-modal").empty();
    // Append the order details to the modal
    $("#order-modal").append(
      `<div class="modal-content"> 
      <h2 class="order-modal-title">Order #${order.order_nr}
      <span class="close-icon"><i class="fas fa-times"></i></span>
      </h2>
      <hr class="hr-style"></hr>
      <label for="items">Items:</label>
      <div class="order-modal-list">
        ${order.items
          .map(
            (item) => `<p> ${item.quantity}X ${item.name} 
            ${
              order.status == "pending"
                ? `<span class="order-modal-remove" data-order_nr="${order.order_nr}" data-item_nr="${item.nr}"><i class="fas fa-times"></i></span>`
                : ""
            }
        </p> `
          )
          .join("")}
      </div>
      <hr class="hr-style"></hr>
      <p class="modal-total">Total Amount:   <span>${
        order.amount
      } SEK</span></p>
      </div>`
    );
    $("#order-modal").show();
  } else {
    // If the order is not found, show an alert
    alert("Order not found");
  }
}

// Initializes event listeners for various user actions
// - Toggling user roles between customer and staff.
// - Logging out and clearing user-specific UI states.
// - Filtering products based on type, dietary restrictions, search queries, and sorting preferences.
// - Managing the shopping cart, including adding and removing items.
// - Enabling drag-and-drop functionality for adding items to and removing items from the cart.
// - Viewing detailed order items and closing order modals.
// - Removing items from orders and alerting security.
// This comprehensive setup ensures responsive and interactive UI components throughout the app.

function callEventListeners() {
  // Handling entry into the pub as a customer, showing the app UI and initializing UI states
  $("#enter-pub").on("click", function () {
    currentSystem = "customer";
    localStorage.setItem("currentSystem", "customer");
    $("#landing").hide();
    $("#staff-container").hide();
    $("#app").show();
    showFilters();
    updateWelcomeText();
    updateCartUI();
    updateServiceOptions();
    $("#menu-container").show();
  });

  // event listener for opening the login modal for customer login
  $(".login-btn").on("click", function () {
    openLogin();
  });

 // event listener for clicks on the "choose-staff" button, triggering the staffIsChosen function to switch the user interface to staff mode
  $("#choose-staff").on("click", function () {
    staffIsChosen();
  });

  // event listener for logging out
  $(".logout-btn").on("click", function () {
    logout();
  });

  // event listener for filtering products
  $(".filter-buttons .secondary-btn").on("click", function () {
    currentFilters.type = $(this).text();
    applyFilters();
  });

  // event listener for checkbox changes on gluten free
  $(".gluten").on("change", function () {
    currentFilters.isGlutenFree = this.checked;
    applyFilters();
  });

  // event listener for checkbox changes on tannin free
  $(".tannin").on("change", function () {
    currentFilters.isTanninFree = this.checked;
    applyFilters();
  });

  // event listener for checkbox changes on organic
  $(".organic").on("change", function () {
    currentFilters.isOrganic = this.checked;
    applyFilters();
  });

  // event listener for checkbox changes on kosher
  $(".kosher").on("change", function () {
    currentFilters.isKosher = this.checked;
    applyFilters();
  });

  // event listener for input changes on search bar
  $(".search-bar").on("input", function () {
    currentFilters.search = $(this).val();
    applyFilters();
  });

  // event listener for changes on sort by dropdown
  $(".sortby").on("change", function () {
    currentFilters.sort = $(this).val();
    applyFilters();
  });

  // event listener for removing items from the cart
  $(".cart-container").on("click", ".remove-icon", function () {
    const itemNr = $(this).data("nr");
    removeFromCart(itemNr);
  });

  // event listener for dragging items to the cart
  $(".cart-container").on("dragover", function (e) {
    e.preventDefault(); // This allows us to drop.
  });

  // event listener for dropping items to the cart
  $(".cart-container").on("drop", function (e) {
    e.preventDefault(); // Prevent default action

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
  $(".products").on("dragover", function (e) {
    e.preventDefault(); // Allow drop
  });

  // For drop from cart
  $(".products").on("drop", function (e) {
    e.preventDefault();
    const itemNr = e.originalEvent.dataTransfer.getData("text");
    removeFromCart(itemNr);
  });

  // event listener for when the service option changes
  $("input[name='service']").change(function () {
    toggleTableNumberInput();
  });

  // event listener for clicking on an order item to open its modal (in staff view)
  $(document).on("click", ".order-item", function (event) {
    const orderNr = $(this).data("order_nr");
    viewOrderItem(orderNr);
  });

  // event listener for closing the order modal (in staff view)
  $(document).on("click", ".close-icon", function (event) {
    $("#order-modal").hide();
  });

  // event listener for removing an item from an order in order modal (in staff view)
  $(document).on("click", ".order-modal-remove", function () {
    const orderNr = $(this).data("order_nr");
    const itemNr = $(this).data("item_nr");
    removeItemFromOrder(orderNr, itemNr);
  });

  // event listener for alerting security (in staff view)
  $(document).on("click", ".alert-security", function (event) {
    alert("Security has been alerted!");
  });
}
