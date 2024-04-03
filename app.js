// Referencia a elementos del DOM
const productListElement = document.getElementById('product-list');
const cartItemsElement = document.getElementById('cart-items');
const totalElement = document.getElementById('total');
const checkoutBtn = document.getElementById('checkoutBtn');

// Array para almacenar los productos disponibles
let products = [];

// Array para almacenar los productos en el carrito
let cart = [];

// Función para obtener los productos de forma asíncrona desde un archivo JSON local
async function getProducts() {
    try {
        const response = await fetch('products.json.js');
        if (!response.ok) {
            throw new Error('Error al obtener los productos');
        }
        products = await response.json();
        return products;
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        return [];
    }
}

// Función para renderizar la lista de productos
async function renderProductList() {
    try {
        await getProducts();
        productListElement.innerHTML = '';
        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'col-md-4 mb-3';
            card.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">$${product.price.toFixed(2)}</p>
                        <div class="btn-group" role="group">
                            <button class="btn btn-primary add-to-cart" data-id="${product.id}">Agregar al carrito</button>
                            <button class="btn btn-danger remove-from-cart" data-id="${product.id}">Eliminar del carrito</button>
                        </div>
                    </div>
                </div>
            `;
            productListElement.appendChild(card);
        });
    } catch (error) {
        console.error('Error al renderizar la lista de productos:', error);
    }
}

// Función para agregar un producto al carrito
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        renderCart();
        Swal.fire({
            title: '¡Producto agregado!',
            text: `Se ha agregado ${product.name} al carrito.`,
            icon: 'success',
            confirmButtonText: 'Aceptar'
        });
    }
}

// Función para sacar un producto del carrito
function removeFromCart(productId) {
    const index = cart.findIndex(item => item.id === productId);
    if (index !== -1) {
        cart.splice(index, 1); // Eliminar solo un elemento en la posición index
        renderCart();
        Swal.fire({
            title: 'Producto eliminado',
            text: 'El producto ha sido eliminado del carrito.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        });
    } else {
        Swal.fire({
            title: 'Error',
            text: 'No se encontró el producto en el carrito.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    }
}
    

// Función para renderizar el carrito
function renderCart() {
    cartItemsElement.innerHTML = '';
    let totalPrice = 0;
    cart.forEach(item => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = `${item.name} - $${item.price.toFixed(2)}`;
        cartItemsElement.appendChild(li);
        totalPrice += item.price;
    });
    totalElement.textContent = totalPrice.toFixed(2);
}

// Función para realizar la compra
function checkout() {
    Swal.fire({
        title: '¡Compra realizada!',
        text: '¡Gracias por tu compra!',
        icon: 'success',
        confirmButtonText: 'Aceptar'
    });
    cart = [];
    renderCart();
}

// Evento click en el botón de checkout
checkoutBtn.addEventListener('click', checkout);

// Evento click en los botones de agregar al carrito y sacar del carrito
productListElement.addEventListener('click', (event) => {
    if (event.target.classList.contains('add-to-cart')) {
        const productId = parseInt(event.target.getAttribute('data-id'));
        addToCart(productId);
    } else if (event.target.classList.contains('remove-from-cart')) {
        const productId = parseInt(event.target.getAttribute('data-id'));
        removeFromCart(productId);
    }
});

// Inicializar la aplicación
renderProductList();

// Centrar el botón de "Realizar compra" en el medio
checkoutBtn.classList.add('mx-auto', 'd-block');
