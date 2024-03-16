import { DB } from "./model.js";

// global variables
let cart = [];
let role = "";
let currentSystem = "";
let userFullName = "";
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

$(document).ready(function () {
  showLandingPage();
  callEventListeners();
  checkAuthentication();
  updateWelcomeText();
  setOrdersInStorage();
  $(document).on("change", "input[name='service']", function () {
    toggleTableNumberInput();
  });
  updateServiceOptions();
});

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
      <div class="landing-btns">
      <button type="button" class="primary-btn landing-btn" id="enter-pub">Customer</button>
      <button type="button" class="primary-btn landing-btn" id="choose-staff">Staff</button>
      </div>
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
  const productsDiv = $(".products");
  productsDiv.empty();

  if (filteredProducts.length === 0) {
    productsDiv.innerHTML = `<p class="no-products">No products found</p>`;
  }

  // Iterate through filtered products and create elements for each
  filteredProducts.forEach((product) => {
    // Create the product item element
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

function showFilters() {
  returnFilterButtons();
  filterByType("All");
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
  const cartContainer = $(".cart-container");
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
    cartContainer.append(`<ul class="cart-items"></ul>`)
    cart.forEach((item) => {
      $('.cart-items').append(`
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
    updateServiceOptions();
    updateTotalPrice();
    updateTotalPriceDisplay();
  }
}

function toggleTableNumberInput() {
  if ($("input[name='service']:checked").val() === "table") {
    $(".table-number").show();
  } else {
    $(".table-number").hide();
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
    orderNumber = "003";
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
    localStorage.setItem("orders", JSON.stringify(orders));
    const randomNumber = Math.floor(Math.random() * 1000);
    $("input[name='service']:checked").val() === "fridge"
      ? alert(
          `Order placed successfully. Your order number is ${orderNumber}. The fridge code is ${randomNumber}`
        )
      : alert(`Order placed successfully. Your order number is ${orderNumber}`);
    clearCart();
  } else {
    alert(
      "Cart is empty. Please add items to your cart before placing an order."
    );
  }
}

function setOrdersInStorage() {
  orders = DB.orders;
  if (!localStorage.getItem("orders")) {
    localStorage.setItem("orders", JSON.stringify(orders));
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
    if (currentSystem == "staff") {
      showStaffMain();
      updateWelcomeText();
    } else {
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

function logout() {
  localStorage.removeItem("username");
  localStorage.removeItem("role");
  localStorage.removeItem("userId");
  localStorage.removeItem("userFullName");
  clearCart();
  window.location.href = "index.html";
  $("#landing").show();
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
  if (localStorage.getItem("role") == "3") {
    role = localStorage.getItem("role");
    // $("#welcome-container").append(`
    //     <p>Welcome to Flying Dutchman Pub ${
    //       localStorage.getItem("userFullName")
    //         ? localStorage.getItem("userFullName")
    //         : ""
    //     }!</p>
    //     <p> Enjoy our wide range of drinks and have a great time!</p>`);
    updateServiceOptions();
    $(".login-btn").hide();
    $(".logout-btn").show();
  } else {
    $(".login-btn").show();
    $(".logout-btn").hide();
  }
}
function updateServiceOptions() {
  const role = localStorage.getItem("role");

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

function updateWelcomeText() {
  let position = "";
  localStorage.getItem("role") == "0"
    ? (position = "Manager")
    : localStorage.getItem("role") == "1"
    ? (position = "Bartender")
    : (position = "Waiter");
  $("#welcome-container").empty();
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

//******** STAFF ********
function staffIsChosen() {
  currentSystem = "staff";
  localStorage.setItem("currentSystem", "staff");
  $("#landing").hide();
  $("#menu-container").hide();
  $(".login-btn").hide();
  $(".logout-btn").hide();
  $("#welcome-container").hide();
  $("#staff-container").hide();
  $("#filter-section").hide();
  $("#app").show();
  if (localStorage.getItem("role") && localStorage.getItem("role") != "3") {
    showStaffMain();
  } else {
    openLogin();
  }
}

function showStaffMain() {
  showFilters();
  $("#staff-container").show();
  $("#filter-section").show();
  $("#welcome-container").show();
  $(".logout-btn").show();
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
  updateOrdersList();
  // applyFilters();
}

function updateOrdersList() {
  const ordersList = JSON.parse(localStorage.getItem("orders") || []);
  const ordersListContainer = $(".orders-container");
  ordersListContainer.empty();
  ordersListContainer.append(`<div class="order-title">Orders List</div>
  <hr class="hr-style"> </hr>`);
  if (ordersList.length == 0) {
    ordersListContainer.append(
      `<div class="empty-text">
      <p>No current orders to handle. Enjoy the break, and stay ready for when the next order comes in!
      </p>
      </div>`
    );
  } else {
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

    ordersList.forEach((item) => {
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

function removeItemFromOrder(orderNr, itemNr) {
  const ordersList = JSON.parse(localStorage.getItem("orders") || []);
  const order = ordersList.find((order) => order.order_nr === orderNr);
  if (order) {
    const item = order.items.find((item) => item.nr == itemNr);
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
      const totalPrice = order.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      order.amount = totalPrice;
      if (orderIndex !== -1) {
        ordersList[orderIndex] = order;
        localStorage.setItem("orders", JSON.stringify(ordersList));
        $("#order-modal").hide();
        updateOrdersList();
      }
    }
  }
}

function viewOrderItem(orderNr) {
  const ordersList = JSON.parse(localStorage.getItem("orders") || []);
  const order = ordersList.find((order) => order.order_nr === orderNr);
  if (order) {
    // Display the order details
    $("#order-modal").empty(); // Clear the modal content first
    $("#order-modal").append(
      `<div class="modal-content"> 
      <h2 class="order-modal-title">Order #${order.order_nr}
      <span class="order-close-icon"><i class="fas fa-times"></i></span>
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
    alert("Order not found");
  }
}

// **********************

function callEventListeners() {
  $("#enter-pub").on("click", function () {
    currentSystem = "customer";
    localStorage.setItem("currentSystem", "customer");
    $("#landing").hide();
    $("#staff-container").hide();
    $("#app").show();
    showFilters();
    updateWelcomeText();
    fetchCart();
    updateServiceOptions();
    $("#menu-container").show();
  });

  $(".login-btn").on("click", function () {
    openLogin();
  });

  $("#choose-staff").on("click", function () {
    staffIsChosen();
  });

  $(".logout-btn").on("click", function () {
    logout();
  });

  $(".filter-buttons .secondary-btn").on("click", function () {
    currentFilters.type = $(this).text();
    applyFilters();
  });

  // Event listener for checkbox changes
  $(".gluten").on("change", function () {
    currentFilters.isGlutenFree = this.checked;
    applyFilters();
  });

  $(".tannin").on("change", function () {
    currentFilters.isTanninFree = this.checked;
    applyFilters();
  });

  $(".organic").on("change", function () {
    currentFilters.isOrganic = this.checked;
    applyFilters();
  });

  $(".kosher").on("change", function () {
    currentFilters.isKosher = this.checked;
    applyFilters();
  });

  $(".search-bar").on("input", function () {
    currentFilters.search = $(this).val();
    applyFilters();
  });

  $(".sortby").on("change", function () {
    currentFilters.sort = $(this).val();
    applyFilters();
  });

  $(".cart-container").on("click", ".remove-icon", function () {
    const itemNr = $(this).data("nr");
    removeFromCart(itemNr);
  });

  // For drag over
  $(".cart-container").on("dragover", function (e) {
    e.preventDefault(); // This allows us to drop.
  });

  // For drop
  $(".cart-container").on("drop", function (e) {
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
  $(".products").on("dragover", function (e) {
    e.preventDefault(); // Allow drop
  });

  $(".products").on("drop", function (e) {
    e.preventDefault();
    const itemNr = e.originalEvent.dataTransfer.getData("text");
    removeFromCart(itemNr);
  });

  // Event listener for when the service option changes
  $("input[name='service']").change(function () {
    toggleTableNumberInput();
  });

  $(document).on("click", ".order-item", function (event) {
    const orderNr = $(this).data("order_nr");
    viewOrderItem(orderNr);
  });

  $(document).on("click", ".order-close-icon", function (event) {
    $("#order-modal").hide();
  });

  $(document).on("click", ".order-modal-remove", function () {
    const orderNr = $(this).data("order_nr");
    const itemNr = $(this).data("item_nr");
    removeItemFromOrder(orderNr, itemNr);
  });

  $(document).on("click", ".alert-security", function (event) {
    alert("Security has been alerted!");
  });
}
