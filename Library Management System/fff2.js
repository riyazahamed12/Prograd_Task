const loginBtn = document.querySelector('.login-btn');
const logoutBtn = document.querySelector('.logout-btn');
const cartBtn = document.querySelector('.cart-btn');
const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');
const booksContainer = document.querySelector('.books-container');
const loader = document.querySelector('.loader');
const cartPage = document.querySelector('.cart-page');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartItemsData = [];
let nextPageToken = ''; // Track the next page token for pagination

loginBtn.addEventListener('click', () => {
  console.log('Login clicked');
  window.location.href = 'f1.html';
});

logoutBtn.addEventListener('click', () => {
  console.log('Logout clicked');
  window.location.href = 'f1.html'
});

cartBtn.addEventListener('click', () => {
  window.location.href = 'cart.html';
});

const filterBtn = document.querySelector('.filter-btn');
const filters = document.querySelector('.book-search select');

filterBtn.addEventListener('click', () => {
  filters.classList.toggle('show-filters');
});

searchBtn.addEventListener('click', () => {
  const searchTerm = searchInput.value;
  const filterBy = filters.value;

  nextPageToken = '';
  booksContainer.innerHTML = '';

  const loadMoreBooks = () => {
    loader.style.display = 'block';

    const apiEndpoint = `https://openlibrary.org/search.json?q=${searchTerm}&page=${nextPageToken}`;
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        const bookData = data.docs.map(item => {
          return {
            title: item.title || 'N/A',
            author: item.author_name?.[0] || 'N/A',
            published: item.first_publish_year || 'N/A',
            price: 'N/A' // No price data available in this example API
          };
        });


        bookData.forEach(book => {
          const bookCard = document.createElement('div');
          bookCard.classList.add('book-card');
          bookCard.innerHTML = `
            <h3 class="book-title">${book.title}</h3>
            <div class="book-info">
              <p>Author: ${book.author}</p>
              <p>Published Year: ${book.published}</p>
              <p>Price: ${book.price}</p>
            </div>
            <button class="add-to-cart-btn">Add to Cart</button>
          `;

          const addToCartBtn = bookCard.querySelector('.add-to-cart-btn');
          addToCartBtn.addEventListener('click', () => {
            addToCart(book);
          });

          booksContainer.appendChild(bookCard);
        });

        nextPageToken++; 
        loader.style.display = 'none';
      })
      .catch(error => {
        console.log('An error occurred:', error);
        loader.style.display = 'none';
      });
  };

  function addToCart(book) {
    const existingCartItem = cartItemsData.find(item => item.title === book.title);
    if (existingCartItem) {
      existingCartItem.quantity++;
    } else {
      cartItemsData.push({ title: book.title, price: book.price, quantity: 1 });
    }
    updateCart();
    saveCartData();
  }
  
  function removeFromCart(book) {
    const existingCartItem = cartItemsData.find(item => item.title === book.title);
    if (existingCartItem) {
      existingCartItem.quantity--;
      if (existingCartItem.quantity === 0) {
        const index = cartItemsData.indexOf(existingCartItem);
        cartItemsData.splice(index, 1);
      }
    }
    updateCart();
    saveCartData();
  }
  
  function saveCartData() {
    localStorage.setItem('cartItems', JSON.stringify(cartItemsData));
  }
  

  function updateCart() {
    cartItems.innerHTML = '';
    cartTotal.innerHTML = '';

    if (cartItemsData.length === 0) {
      cartItems.innerHTML = '<p>Your cart is empty.</p>';
    } else {
      cartItemsData.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
          <span>${item.title}</span>
          <span>Quantity: ${item.quantity}</span>
          <span>Price: $${item.price}</span>
          <span>Total: $${item.price * item.quantity}</span>
          <button class="delete-btn">Delete</button>
        `;

        const deleteBtn = cartItem.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
          removeFromCart(item);
        });

        cartItems.appendChild(cartItem);
      });

      const totalCost = cartItemsData.reduce((total, item) => total + item.price * item.quantity, 0);
      cartTotal.textContent = `Total: $${totalCost}`;
    }
  }

  // Attach the scroll event listener for infinite scrolling
  window.addEventListener('scroll', () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      loadMoreBooks();
    }
  });

  // Call loadMoreBooks initially to load the first set of results
  loadMoreBooks();
});
