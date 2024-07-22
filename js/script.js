const API_URL = 'https://fakestoreapi.com/products';
let products = [];
let filteredProducts = [];
let currentPage = 1;
const itemsPerPage = 10;

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    setupSearch();
    setupLoadMore();
});

async function fetchProducts() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        products = data;
        filteredProducts = products;
        displayProducts(filteredProducts.slice(0, itemsPerPage));
    } catch (error) {
        console.error('Error fetching products:', error);
        alert('Failed to fetch products. Please try again later.');
    }
}

function displayProducts(products) {
    const productsContainer = document.getElementById('products');
    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product';
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>$${product.price}</p>
        `;
        productsContainer.appendChild(productElement);
    });
}

function setupSearch() {
    const searchInput = document.getElementById('search');
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        filteredProducts = products.filter(product => product.title.toLowerCase().includes(query));
        document.getElementById('products').innerHTML = '';
        displayProducts(filteredProducts.slice(0, itemsPerPage));
    });
}

function setupLoadMore() {
    const loadMoreButton = document.getElementById('load-more');
    loadMoreButton.addEventListener('click', () => {
        currentPage++;
        const nextPageProducts = filteredProducts.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
        displayProducts(nextPageProducts);
    });
}


// 
function setupFilters() {
    const filtersContainer = document.getElementById('filters');
    // Add filter elements (e.g., checkboxes, dropdowns)
}

function setupSorting() {
    const sortSelect = document.getElementById('sort');
    sortSelect.addEventListener('change', () => {
        const sortBy = sortSelect.value;
        if (sortBy === 'price-asc') {
            filteredProducts.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-desc') {
            filteredProducts.sort((a, b) => b.price - a.price);
        }
        document.getElementById('products').innerHTML = '';
        displayProducts(filteredProducts.slice(0, itemsPerPage));
    });
}


//

async function fetchProducts() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        products = data;
        filteredProducts = products;
        displayProducts(filteredProducts.slice(0, itemsPerPage));
    } catch (error) {
        console.error('Error fetching products:', error);
        alert('Failed to fetch products. Please try again later.');
    }
}

function displayLoadingState() {
    const productsContainer = document.getElementById('products');
    const loadingElement = document.createElement('div');
    loadingElement.className = 'loading';
    loadingElement.innerHTML = 'Loading...';
    productsContainer.appendChild(loadingElement);
}

function removeLoadingState() {
    const loadingElement = document.querySelector('.loading');
    if (loadingElement) loadingElement.remove();
}

async function loadMoreProducts() {
    displayLoadingState();
    try {
        await fetchProducts();
        removeLoadingState();
    } catch (error) {
        removeLoadingState();
        alert('Failed to load more products. Please try again later.');
    }
}
