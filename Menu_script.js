// Purpose: To create a menu for the restaurant and allow the user to add items to the cart and place an order.

import { DB } from "./model.js";

// Initialize an empty shopping cart array
let cart = [];

// Function to filter and display products by category
function filterCategory(category) {
  const productsDiv = document.getElementById("products");
  productsDiv.innerHTML = ""; // Clear the products display

  // Filter products based on the selected category
  const filteredProducts = DB.products.filter(
    (product) => product.type === category
  );

  // Iterate through filtered products and create elements for each
  displayFilteredProducts(filteredProducts);
}

// Function to display all products when the page is loaded
function displayAllProducts() {
  const productsDiv = document.getElementById("products");
  productsDiv.innerHTML = ""; // Clear the products display

  // Sort products by name alphabetically
  const sortedProducts = DB.products.sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  displayFilteredProducts(sortedProducts);
}
// Show all products when the page is loaded
document.addEventListener("DOMContentLoaded", displayAllProducts());

// Function to choose gluten free products
function filterGlutenFree() {
  const productsDiv = document.getElementById("products");
  productsDiv.innerHTML = ""; // Clear the products display

  const isGlutenFreeChecked = document.getElementById("gluten").checked;

  const filteredProducts = DB.products.filter((product) => {
    const meetsGlutenFree = isGlutenFreeChecked ? product.gluten === 0 : true;
    return meetsGlutenFree;
  });

  const sortedProducts = filteredProducts.sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  displayFilteredProducts(sortedProducts);
}
document.getElementById("gluten").addEventListener("change", filterGlutenFree);

// Function to choose tannin free products
function filterTanninFree() {
  const productsDiv = document.getElementById("products");
  productsDiv.innerHTML = ""; // Clear the products display

  const isTanninFreeChecked = document.getElementById("tannin").checked;

  const filteredProducts = DB.products.filter((product) => {
    const meetsTanninFree = isTanninFreeChecked ? product.tannin === 0 : true;
    return meetsTanninFree;
  });

  const sortedProducts = filteredProducts.sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  displayFilteredProducts(sortedProducts);
}
document.getElementById("tannin").addEventListener("change", filterTanninFree);

// Function to search for products
function searchProducts() {
  const searchInput = document.getElementById("search-bar").value.toLowerCase();
  const productsDiv = document.getElementById("products");
  productsDiv.innerHTML = "";

  const filteredProducts = DB.products.filter((product) => {
    product.name.toLocaleLowerCase().includes(searchInput);
  });

  displayFilteredProducts(filteredProducts);
}
document.getElementById("search-bar").addEventListener("input", searchProducts);

function sortedProducts() {
  const sortBy = document.getElementById("sortby").value;
  let sortedProducts;

  switch (sortBy) {
    case "price_low_high":
      sortedProducts = DB.products.sort((a, b) => a.price - b.price);
      break;
    case "price_high_low":
      sortedProducts = DB.products.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      sortedProducts = DB.products.sort(
        (a, b) =>
          new Date(b.introduced.substring(0, 4)) -
          new Date(a.introduced.substring(0, 4))
      );
      break;
    case "oldest":
      sortedProducts = DB.products.sort(
        (a, b) =>
          new Date(a.introduced.substring(0, 4)) -
          new Date(b.introduced.substring(0, 4))
      );
      break;
    default:
      sortedProducts = DB.products;
      break;
  }
  displayFilteredProducts(sortedProducts);
}
document.getElementById("sortby").addEventListener("change", sortedProducts);

function displayFilteredProducts(products) {
  const productsDiv = document.getElementById("products");
  productsDiv.innerHTML = ""; // 清除之前的产品显示

  products.forEach((product) => {
    const div = document.createElement("div");
    div.textContent = `${product.name} - ${product.price}kr`;

    div.onclick = function () {
      addToCart(product.name, product.price);
    };

    productsDiv.appendChild(div);
  });
}

// Function to generate the category list
function generateCategories() {
  const sidebarUl = document.getElementById("sidebar");
  sidebarUl.className = "category";
  sidebarUl.innerHTML = ""; // Clear existing list items

  // Create and insert the 'Category' title
  const categoryTitle = document.createElement("h2");
  categoryTitle.textContent = "Category";
  categoryTitle.style.textAlign = "center";
  sidebar.appendChild(categoryTitle);

  const allProductsItem = document.createElement("li");
  allProductsItem.textContent = "All Products";
  allProductsItem.className = "category-item";
  allProductsItem.onclick = function () {
    displayAllProducts();
  };
  sidebarUl.appendChild(allProductsItem);

  // Get unique categories and sort them
  const categories = Array.from(
    new Set(DB.products.map((product) => product.type))
  ).sort((a, b) => a.localeCompare(b));

  categories.forEach((category) => {
    const listItem = document.createElement("li");
    listItem.textContent = category;
    listItem.className = "category-item";
    listItem.onclick = function () {
      filterCategory(category);
    };
    sidebarUl.appendChild(listItem);
  });
}
document.addEventListener("DOMContentLoaded", generateCategories);

// Function to add a product to the shopping cart
function addToCart(name, price) {
  const itemIndex = cart.findIndex((item) => item.name === name);

  if (itemIndex > -1) {
    cart[itemIndex].quantity += 1; // If the item exists in the cart, increase its quantity
  } else {
    cart.push({ name, price, quantity: 1 }); // If the item is not in the cart, add it as a new item
  }

  // Update the cart UI to reflect the changes
  updateCartUI();
}

// Function to update the shopping cart UI
function updateCartUI() {
  const cartItems = document.getElementById("cartItems");
  cartItems.innerHTML = "";

  // Iterate through items in the cart and create list items for each
  cart.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - ${item.price}kr x ${item.quantity}`;
    cartItems.appendChild(li);
  });

  // Update the total price in the UI
  updateTotalPrice();
}

// Function to update the total price in the UI
function updateTotalPrice() {
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  document.getElementById("totalPrice").textContent = totalPrice;
}

// Function to clear the shopping cart
function clearCart() {
  cart = [];
  updateCartUI();
}
document.getElementById("clearButton").addEventListener("click", clearCart);

// Function to get and increment the order number from localStorage
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
    alert(`Order placed successfully. Your order number is ${orderNumber}`);
    clearCart();

    // Jump to Bartender page
  } else {
    alert(
      "Cart is empty. Please add items to your cart before placing an order."
    );
  }
}

document.getElementById("orderButton").addEventListener("click", placeOrder);

// Function to update the UI for logged-in users
// function updateUIForLoggedInUser() {
//   if (isUserLoggedIn == 1) {
//     const orderButton = document.getElementById("orderButton"); // Assuming you have an order button with this ID
//     orderButton.style.display = "none"; // Hide the existing order button
//     // Create a new 'Pay' button
//     const payButton = document.createElement("button");
//     payButton.textContent = "Pay";
//     payButton.id = "payButton";

//     // Define the delivery options
//     const deliveryOptionSelect = document.createElement("select");
//     deliveryOptionSelect.id = "deliveryOption";
//     deliveryOptionSelect.innerHTML = `
//             <option value="self-service">Self-service</option>
//             <option value="table-service">Table-service</option>
//         `;

//     // Append the delivery options and pay button to the cart
//     const cartDiv = document.getElementById("cart"); // Make sure this is the correct ID for your cart element
//     cartDiv.appendChild(deliveryOptionSelect);
//     cartDiv.appendChild(payButton);

//     // Event listener for the 'Pay' button
//     payButton.addEventListener("click", function () {
//       if (cart.length > 0) {
//         const selectedOption = deliveryOptionSelect.value;
//         if (selectedOption === "self-service") {
//           generateTakeawayCode();
//         } else if (selectedOption === "table-service") {
//           // If 'table-service' is selected, show table number selection
//           const tableNumber = prompt("Please enter your table number (1-30):");
//           if (
//             tableNumber &&
//             parseInt(tableNumber) >= 1 &&
//             parseInt(tableNumber) <= 30
//           ) {
//             alert(
//               `Order paied successfully. Your order number is ${getOrderNumber()} for table ${tableNumber}.`
//             );
//           } else {
//             alert(
//               "Invalid table number. Please enter a number between 1 and 30."
//             );
//           }
//         }
//         clearCart();
//       } else {
//         alert(
//           "Cart is empty. Please add items to your cart before placing an order."
//         );
//       }
//     });
//   }
// }

// Function to show table number selection
// function showTableNumberSelection() {
//   let tableNumberSelect = document.getElementById("tableNumber");
//   if (!tableNumberSelect) {
//     tableNumberSelect = document.createElement("select");
//     tableNumberSelect.id = "tableNumber";
//     for (let i = 1; i <= 20; i++) {
//       tableNumberSelect.options.add(new Option(i, i));
//     }
//     const deliveryOption = document.getElementById("deliveryOption");
//     deliveryOption.after(tableNumberSelect);
//   }
// }

// Function to hide table number selection
// function hideTableNumberSelection() {
//   const tableNumberSelect = document.getElementById("tableNumber");
//   if (tableNumberSelect) {
//     tableNumberSelect.remove();
//   }
// }

// Function to generate a random 4-digit code for takeaway orders
// function generateTakeawayCode() {
//   const code = Math.floor(1000 + Math.random() * 9000); // Generates a number between 1000 and 9999
//   alert(`Order paied successfully. Self Service Code: ${code}`);
// }
