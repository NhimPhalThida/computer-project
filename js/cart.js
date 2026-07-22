// Persistent Cart Management System for CP-Shop
// Uses LocalStorage to persist items across page changes.
// Dynamically creates and manages the Bootstrap Offcanvas Cart UI.

let cart = JSON.parse(localStorage.getItem('cp_cart')) || [];

// Inject Offcanvas HTML on initialization
function injectOffcanvasHTML() {
  if (document.getElementById('cartOffcanvas')) return;

  const offcanvasHTML = `
    <div class="offcanvas offcanvas-end" tabindex="-1" id="cartOffcanvas" aria-labelledby="cartOffcanvasLabel" style="border-left: 1px solid rgba(0,0,0,0.08); background: #fff; width: 420px; max-width: 100vw; z-index: 1060; transition: transform 0.3s ease-in-out;">
      <div class="offcanvas-header" style="padding: 30px 24px 15px 24px; border: none;">
        <h4 class="offcanvas-title fw-bold" id="cartOffcanvasLabel" style="color: var(--text-dark); display: flex; align-items: center; gap: 10px; font-size: 1.5rem; font-family: 'Poppins', sans-serif;">
          <i class="bi bi-cart3 fs-3"></i>
          Your Shopping Cart
        </h4>
        <button type="button" class="btn-close text-reset fs-5" data-bs-dismiss="offcanvas" aria-label="Close" style="box-shadow: none; border: none; background-color: transparent; opacity: 0.5;"></button>
      </div>
      <div class="offcanvas-body d-flex flex-column" style="padding: 0 24px 30px 24px; overflow: hidden;">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <span class="fs-4 fw-normal text-dark" style="font-family: 'Poppins', sans-serif;">Total:</span>
          <span class="fs-4 fw-bold text-danger" id="cart-total-price" style="font-family: 'Poppins', sans-serif; color: var(--price-red) !important;">0$</span>
        </div>
        
        <div class="cart-items-card border p-3 flex-grow-1" style="border-radius: 24px; border-color: rgba(0, 0, 0, 0.08) !important; background-color: #fff; display: flex; flex-direction: column; overflow: hidden; max-height: calc(100vh - 250px);">
          <div id="cart-items-container" class="flex-grow-1 overflow-auto pe-1" style="scrollbar-width: thin;">
            <!-- Cart items rendered dynamically -->
          </div>
        </div>
        
        <div class="text-center mt-4">
          <button class="btn btn-outline-checkout px-5 py-2 fw-semibold" id="btn-checkout" style="border-radius: 50px; font-size: 1.15rem; min-width: 220px; padding: 10px 40px !important;">
            Checkout
          </button>
        </div>
      </div>
    </div>

    <!-- Custom Checkout Success Modal matching mockup -->
    <div id="checkoutSuccessModal" class="checkout-modal-overlay">
      <div class="checkout-modal-card">
        <div class="success-icon-wrapper">
          <div class="success-icon-outer">
            <div class="success-icon-inner">
              <i class="bi bi-check-lg"></i>
            </div>
          </div>
        </div>
        <h3 class="checkout-modal-title">Payment Confirmed</h3>
        <p class="checkout-modal-desc">
          Your order is being prepared<br>
          Estimated arrival in 15 min
        </p>
        <button class="btn btn-back-home" id="btn-modal-back-home">Back to home</button>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', offcanvasHTML);
}

// Update Badges Count on Header
function updateBadges() {
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badges = document.querySelectorAll('#cart-badge');
  badges.forEach(badge => {
    if (totalCount > 0) {
      badge.textContent = totalCount;
      badge.classList.remove('d-none');
    } else {
      badge.classList.add('d-none');
    }
  });
}

// Save Cart to LocalStorage and update UI
function saveCart() {
  localStorage.setItem('cp_cart', JSON.stringify(cart));
  updateBadges();
  renderCartItems();
}

// Add Item to Cart
window.addToCart = function(product) {
  // Identify product by title to avoid ID conflicts across pages
  const existingItem = cart.find(item => item.title === product.title);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      brand: product.brand,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }
  saveCart();

  // Show customized Toast notification if it exists in the DOM
  const cartToast = document.getElementById("cart-toast");
  if (cartToast) {
    cartToast.textContent = `Added "${product.brand}" to your cart!`;
    cartToast.style.display = "block";
    setTimeout(() => {
      cartToast.style.display = "none";
    }, 2000);
  }

  // Open the offcanvas automatically for instant visual feedback
  const offcanvasEl = document.getElementById("cartOffcanvas");
  if (offcanvasEl) {
    const bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(offcanvasEl);
    bsOffcanvas.show();
  }
};

// Quantity Adjuster
window.updateCartQuantity = function(title, delta) {
  const item = cart.find(i => i.title === title);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      cart = cart.filter(i => i.title !== title);
    }
    saveCart();
  }
};

// Remove single item
window.removeFromCart = function(title) {
  cart = cart.filter(i => i.title !== title);
  saveCart();
};

// Clear entire cart
window.clearCart = function() {
  cart = [];
  saveCart();
};

// Render Cart HTML items dynamically
function renderCartItems() {
  const container = document.getElementById('cart-items-container');
  const totalPriceEl = document.getElementById('cart-total-price');
  if (!container || !totalPriceEl) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="text-center py-5 text-muted d-flex flex-column align-items-center justify-content-center h-100">
        <i class="bi bi-cart-x text-muted mb-3" style="font-size: 3.5rem;"></i>
        <h6 class="fw-bold text-dark">Your cart is empty</h6>
        <p class="text-muted small px-3">Add items from the store to see them listed here.</p>
      </div>
    `;
    totalPriceEl.textContent = '0$';
    return;
  }

  let html = '';
  let totalPrice = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    totalPrice += itemTotal;

    // Safely escape single quotes for onclick JS strings
    const escapedTitle = item.title.replace(/'/g, "\\'");
    
    // Check if it's the last item in the list, so we don't show border-bottom
    const isLast = index === cart.length - 1;
    const borderStyle = isLast ? '' : 'border-bottom: 1px solid rgba(0, 0, 0, 0.08);';

    html += `
      <div class="cart-item d-flex align-items-start py-3" style="${borderStyle} gap: 15px; position: relative;">
        <img src="${item.image}" alt="${item.title}" class="cart-item-img" style="width: 70px; height: 70px; object-fit: contain; border-radius: 8px; border: 1px solid rgba(0,0,0,0.05); background: white; padding: 2px;" onerror="this.src='https://placehold.co/70x70?text=Laptop'">
        <div class="flex-grow-1 min-w-0">
          <div class="text-dark" style="font-size: 0.92rem; font-weight: 400; line-height: 1.35; font-family: 'Poppins', sans-serif; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; padding-right: 25px;" title="${item.title}">
            ${item.title}
          </div>
          <div class="fw-bold text-danger my-1" style="font-size: 1.05rem; color: var(--price-red) !important; font-family: 'Poppins', sans-serif;">
            ${item.price}$
          </div>
          <div class="d-flex align-items-center gap-2 mt-2">
            <button class="btn-qty" onclick="updateCartQuantity('${escapedTitle}', -1)">-</button>
            <span class="text-dark px-1" style="font-size: 0.95rem; font-family: 'Poppins', sans-serif;">${item.quantity}</span>
            <button class="btn-qty" onclick="updateCartQuantity('${escapedTitle}', 1)">+</button>
          </div>
        </div>
        <button class="btn btn-link text-muted p-1 d-flex align-items-center justify-content-center border-0 bg-transparent" onclick="removeFromCart('${escapedTitle}')" aria-label="Remove Item" style="position: absolute; right: 0; top: 12px; transition: var(--transition);">
          <i class="bi bi-trash3 text-danger fs-5" style="color: var(--price-red) !important; opacity: 0.7;"></i>
        </button>
      </div>
    `;
  });

  container.innerHTML = html;
  totalPriceEl.textContent = `${totalPrice}$`;
}

// DOM Setup
document.addEventListener("DOMContentLoaded", () => {
  // Inject HTML structure
  injectOffcanvasHTML();

  // Attach button triggers
  const cartBtn = document.getElementById("btn-cart");
  if (cartBtn) {
    cartBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const offcanvasEl = document.getElementById("cartOffcanvas");
      if (offcanvasEl) {
        const bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(offcanvasEl);
        bsOffcanvas.show();
      }
    });
  }

  // Checkout Handler
  const checkoutBtn = document.getElementById("btn-checkout");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
      }
      
      // Close offcanvas
      const offcanvasEl = document.getElementById("cartOffcanvas");
      if (offcanvasEl) {
        const bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(offcanvasEl);
        bsOffcanvas.hide();
      }

      // Show payment confirmed modal
      const successModal = document.getElementById("checkoutSuccessModal");
      if (successModal) {
        successModal.classList.add("show");
      }
    });
  }

  // Back to Home Button Handler
  const backHomeBtn = document.getElementById("btn-modal-back-home");
  if (backHomeBtn) {
    backHomeBtn.addEventListener("click", () => {
      const successModal = document.getElementById("checkoutSuccessModal");
      if (successModal) {
        successModal.classList.remove("show");
      }
      
      // Clear the shopping cart
      clearCart();

      // Redirect to index.html if we are on a detail page
      const currentPath = window.location.pathname;
      if (!currentPath.endsWith("index.html") && currentPath !== "/" && currentPath !== "") {
        window.location.href = "index.html";
      }
    });
  }

  // Initialize
  updateBadges();
  renderCartItems();
});
