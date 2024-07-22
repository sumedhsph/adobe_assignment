'use strict';

const API_URL = 'https://fakestoreapi.com/products';
let productsList = [];
let filteredProducts = [];
let currentPage = 1;
const itemsPerPage = 12;

 
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    //setupSearch();
   // setupLoadMore();
});

async function fetchProducts() {
    try {
        console.log('Fetching products from API...');
        const response = await fetch(API_URL);
        console.log('Response received:', response);

        const data = await response.json();
        console.log('Parsed data:', data);

        productsList = data;
        filteredProducts = productsList;
        if(filteredProducts.length !== 0){
            displayProducts(filteredProducts.slice(0, itemsPerPage));
        }
       
    } catch (error) {
        console.error('Error fetching products:', error);
        alert('Failed to fetch products. Please try again later.');
    }
}

//fetchProducts();

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
 
// sort by price
function sortProduct() {
    const sortSelect = document.getElementById('sort');
    sortSelect.addEventListener('change', () => {
        const sortBy = sortSelect.value; // Get the selected value
        console.log(sortBy); // Log the selected value for debugging
        let sortedProducts = [];
         
        if (sortBy === 'lowToHigh') {
            sortedProducts = filteredProducts.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'highToLow') {
            sortedProducts = filteredProducts.sort((a, b) => b.price - a.price);
        }
        
        // Clear and display products
        document.getElementById('products').innerHTML = '';
        displayProducts(sortedProducts.slice(0, itemsPerPage));
    });
}
sortProduct();



// search products
function searchProducts() {
    const searchInput = document.getElementById('search');
    const searchButton = document.getElementById('searchButton');
    let searchResult = [];
    searchButton.addEventListener('click', () => {
        const query = searchInput.value.toLowerCase();
        console.log(query);
        console.log('filteredProducts>>>>>>', filteredProducts);
        if(filteredProducts.length !== 0){
            console.log('inside if >>>>')
            searchResult = filteredProducts.filter((product)=> product.title.toLowerCase().includes(query));
            console.log('searchResult>>>>>>>', searchResult);
            document.getElementById('products').innerHTML = '';
            displayProducts(searchResult.slice(0, itemsPerPage));
        }
        /* if(filteredProducts.length !== 0){
            filteredProducts = products.filter(product => product.title.toLowerCase().includes(query));
            document.getElementById('products').innerHTML = '';
            displayProducts(filteredProducts.slice(0, itemsPerPage));
        } */
        
    });
}
searchProducts();