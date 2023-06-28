const loginBtn = document.querySelector('.login-btn');
    const logoutBtn = document.querySelector('.logout-btn');
    const cartBtn = document.querySelector('.cart-btn');
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    const bookResults = document.querySelector('.book-results');
    const cartPage = document.querySelector('.cart-page');
    const cartItems = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total');
    const cartItemsData = [];

    loginBtn.addEventListener('click', () => {
      console.log('Login clicked');
      window.location.href = './f1.html';
    });

    logoutBtn.addEventListener('click', () => {
      console.log('Logout clicked');
    });

    cartBtn.addEventListener('click', () => {
      cartPage.classList.toggle('show-cart-page');
    });

    const filterBtn = document.querySelector('.filter-btn');
    const filters = document.querySelector('.book-search select');
    

    filterBtn.addEventListener('click', () => {
      filters.classList.toggle('show-filters');
    });

    searchBtn.addEventListener('click', () => {
      const searchTerm = searchInput.value;
      const filterBy = filters.value;

      const apiEndpoint = `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}`;

      fetch(apiEndpoint)
        .then(response => response.json())
        .then(data => {
          const bookData = data.items.map(item => {
            const volumeInfo = item.volumeInfo;
            return {
              title: volumeInfo.title || 'N/A',
              author: volumeInfo.authors?.[0] || 'N/A',
              published: volumeInfo.publishedDate || 'N/A',
              price: volumeInfo.saleInfo?.listPrice?.amount || 'N/A'
            };
          });
          bookResults.innerHTML = '';

          // Filter books based on selected filter option
          let filteredBooks = bookData;
          if (filterBy === 'title') {
            filteredBooks = bookData.filter(book => book.title.toLowerCase().includes(searchTerm.toLowerCase()));
          } else if (filterBy === 'author') {
            filteredBooks = bookData.filter(book => book.author.toLowerCase().includes(searchTerm.toLowerCase()));
          } else if (filterBy === 'published') {
            filteredBooks = bookData.filter(book => book.published === searchTerm);
          } else if (filterBy === 'price') {
            filteredBooks = bookData.filter(book => book.price <= parseFloat(searchTerm));
          }

          // Display filtered books
          filteredBooks.forEach(book => {
            const bookCard = document.createElement('div');
            bookCard.classList.add('book-card');
            bookCard.innerHTML = `
              <h3 class="book-title">${book.title}</h3>
              <div class="book-info">
                <p>Author: ${book.author}</p>
                <p>Published Date: ${book.published}</p>
                <p>Price: $${book.price}</p>
              </div>
              <button class="add-to-cart-btn">Add to Cart</button>
            `;

            const addToCartBtn = bookCard.querySelector('.add-to-cart-btn');
            addToCartBtn.addEventListener('click', () => {
              addToCart(book);
            });

            bookResults.appendChild(bookCard);
          });
        })
        .catch(error => {
          console.log('An error occurred:', error);
        });
    });

    function addToCart(book) {
        const existingCartItem = cartItemsData.find(item => item.title === book.volumeInfo.title);
        if (existingCartItem) {
          existingCartItem.quantity++;
        } else {
          cartItemsData.push({ title: book.volumeInfo.title, price: book.saleInfo.listPrice ? book.saleInfo.listPrice.amount : 0, quantity: 1 });
        }
        updateCart();
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
              <span>Price: $${item.price * item.quantity}</span>
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
