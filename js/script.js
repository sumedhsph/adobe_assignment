"use strict";

const API_URL = "https://fakestoreapi.com/products";
let productsList = [];
let filteredProducts = [];
let displayedProducts = [];
let currentPage = 1;
const itemsPerPage = 12;
let loading = false; // To prevent multiple API calls
const loadingDiv = document.getElementById("loading");


// responsive navbar
document.getElementById('navbar-toggle').addEventListener('click', function() {
  var navbar = document.getElementById('navbar');
  if (navbar.style.display === 'block') {
    navbar.style.display = 'none';
  } else {
    navbar.style.display = 'block';
  }
});



document.addEventListener("DOMContentLoaded", () => {
  fetchAllProducts();
  setupEventListeners();
});

async function fetchAllProducts() {
  try {
    if (loading) return;
    loading = true;
    
    loadingDiv.style.display = "block";
    const response = await fetch(API_URL);
    console.log("Response received:", response);

    const data = await response.json();
    console.log("Parsed data:", data);

    productsList = data;
    filteredProducts = productsList;
    displayProducts(filteredProducts.slice(0, itemsPerPage));
    createCheckboxes();
    updateLoadMoreButton(); // Update Load More button visibility
    loading = false;
    loadingDiv.style.display = "none";
  } catch (error) {
    console.error("Error fetching products:", error);
    loading = false;
    loadingDiv.style.display = "none";
  }
}

function displayProducts(products) {
  const productsContainer = document.getElementById("products");
  productsContainer.innerHTML = ""; // Clear existing products

  products.forEach((product) => {
    const productElement = document.createElement("div");
    productElement.className = "product";
    productElement.innerHTML = `
            <img data-src="${product.image}" alt="${product.title}" class="lazy">
            <h3>${product.title}</h3>
            <p>$${product.price}</p>
        `;
    productsContainer.appendChild(productElement);
  });

  displayedProducts = products; // Update the displayed products

  // Update the product count
  updateProductCount();

  lazyLoadImages(); // Apply lazy loading to the newly added images
}

function createCheckboxes() {
  const catCheckboxes = document.getElementById("categoryCheckboxes");
  catCheckboxes.innerHTML = ""; // Clear any existing checkboxes

  if (productsList.length !== 0) {
    const categories = [
      ...new Set(productsList.map((product) => product.category)),
    ];
    categories.forEach((category) => {
      // Create list item
      const listItem = document.createElement("li");

      // Create checkbox
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = category;
      checkbox.name = "category";
      checkbox.value = category;

      // Create label
      const label = document.createElement("label");
      label.htmlFor = category;
      label.appendChild(document.createTextNode(category));

      // Append checkbox and label to list item
      listItem.appendChild(checkbox);
      listItem.appendChild(label);

      // Append list item to the unordered list
      catCheckboxes.appendChild(listItem);
    });

    // Add event listener for checkboxes
    catCheckboxes.addEventListener("change", filterProductsByCategory);
  }
}

function filterProductsByCategory() {
  // Get all selected categories from checkboxes
  const selectedCategories = Array.from(
    document.querySelectorAll("#categoryCheckboxes input:checked")
  ).map((checkbox) => checkbox.value);

  // Filter products based on selected categories
  if (selectedCategories.length === 0) {
    // If no categories are selected, show all products
    filteredProducts = productsList;
  } else {
    // Filter products where the category is in the selected categories
    filteredProducts = productsList.filter((product) =>
      selectedCategories.includes(product.category)
    );
  }

  currentPage = 1; // Reset to first page
  document.getElementById("products").innerHTML = ""; // Clear existing products
  displayProducts(filteredProducts.slice(0, itemsPerPage));
  updateLoadMoreButton(); // Update Load More button visibility
}

function setupEventListeners() {
  // Sort by price
  const sortSelect = document.getElementById("sort");
  sortSelect.addEventListener("change", () => {
    const sortBy = sortSelect.value;
    let sortedProducts = [];

    if (sortBy === "lowToHigh") {
      sortedProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
    } else if (sortBy === "highToLow") {
      sortedProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
    }

    currentPage = 1; // Reset to first page
    document.getElementById("products").innerHTML = ""; // Clear existing products
    displayProducts(sortedProducts.slice(0, itemsPerPage));
    updateLoadMoreButton(); // Update Load More button visibility
  });

  // Search products
  const searchInput = document.getElementById("search");
  const searchButton = document.getElementById("searchButton");
  searchButton.addEventListener("click", () => {
    const query = searchInput.value.toLowerCase();
    const searchResult = filteredProducts.filter((product) =>
      product.title.toLowerCase().includes(query)
    );
    filteredProducts = searchResult; // Update the filteredProducts
    currentPage = 1; // Reset to first page
    document.getElementById("products").innerHTML = ""; // Clear existing products
    displayProducts(searchResult.slice(0, itemsPerPage));
    updateLoadMoreButton(); // Update Load More button visibility
  });

  // Load More button
  const loadMoreButton = document.getElementById("loadMoreButton");
  loadMoreButton.addEventListener("click", () => {
    if (!loading) {
      const nextProducts = filteredProducts.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
      displayProducts(nextProducts);
      currentPage++;
      updateLoadMoreButton(); // Update Load More button visibility
    }
  });
}

// Lazy loading images with Intersection Observer
function lazyLoadImages() {
  const images = document.querySelectorAll("img.lazy");
  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy");
        observer.unobserve(img);
      }
    });
  }, options);

  images.forEach((image) => observer.observe(image));
}

// Function to update Load More button visibility
function updateLoadMoreButton() {
  const loadMoreButton = document.getElementById("loadMoreButton");
  const totalProducts = filteredProducts.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;

  // Show Load More button only if there are more products to load
  if (totalProducts > endIndex) {
    loadMoreButton.style.display = "block";
  } else {
    loadMoreButton.style.display = "none";
  }
}

// Update product count in the UI
function updateProductCount() {
  const productCounts = document.getElementById("productCounts");
  if (productCounts) {
    productCounts.textContent = displayedProducts.length;
  }
}

