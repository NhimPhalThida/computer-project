const products = [
  {
    id: 1,
    brand: "MacBook",
    title: "MacBook Pro 14\" - Advanced M3 Chip Performance",
    subtext: "Designed for developers, creators, and professionals needing ultimate battery life.",
    price: 1290,
    image: "images/p1.jpg"
  },
  {
    id: 2,
    brand: "MacBook",
    title: "Apple MacBook Air 13,6 -24 GB RAM /1TB/ ",
    subtext: "Designed for developers, creators, and professionals needing ultimate battery life",
    price: 2099,
    image: "images/m1.jpg"
  },
  {
    id: 3,
    brand: "Macbook",
    title: "Apple MacBook Air 14,6 -32 GB RAM ",
    subtext: "Designed for developers, creators, and professionals needing ultimate battery life",
    price: 850,
    image: "images/m3.jpg"
  },
  {
    id: 4,
    brand: "MacBook",
    title: "MacBook Air 13\" - Ultra thin with M3 Power",
    subtext: "Superlight and fast. Ideal for students and on-the-go productivity.",
    price: 799,
    image: "images/m6.jpg"
  },
  {
    id: 5,
    brand: "Macbook",
    title: "Macbook 16inh - Daily Study and Homework Assistant",
    subtext: "Equipped with fast charging options and anti-glare screen display panels.",
    price: 450,
    image:  "images/m5.jpg"
  },
  {
    id: 6,
    brand: "Macbook",
    title: "Macbook Air Plus 14 - Advanced OLED Visual Elegance",
    subtext: "Featuring bright HDR standard screens and quick multi-core cooling systems.",
    price: 680,
    image:  "images/m4.jpg"
  },
  {
    id: 7,
    brand: "MacBook",
    title: "MacBook Air 13\" - Ultra thin with M3 Power",
    subtext: "Superlight and fast. Ideal for students and on-the-go productivity.",
    price: 799,
    image: "images/m4.jpg"
  },
  {
    id: 8,
    brand: "Macbook",
    title: "Macbook pro Inspiron 15 - Daily Study and Homework Assistant",
    subtext: "Equipped with fast charging options and anti-glare screen display panels.",
    price: 450,
    image:  "images/m9.jpg"
  },
  {
    id: 9,
    brand: "Macbook",
    title: "Macbook pro /1TB - Advanced OLED Visual Elegance",
    subtext: "Featuring bright HDR standard screens and quick multi-core cooling systems.",
    price: 680,
    image:  "images/m10.jpg"
  },
  {
    id: 10,
    brand: "MacBook",
    title: "MacBook Air 13\" - Ultra thin with M3 Power",
    subtext: "Superlight and fast. Ideal for students and on-the-go productivity.",
    price: 799,
    image: "images/p4.jpg"
  },
  {
    id: 11,
    brand: "Macbook",
    title: "MAcbook 14Pro  - Daily Study, Homework and develop code Assistant",
    subtext: "Equipped with fast charging options and anti-glare screen display panels.",
    price: 450,
    image:  "images/m7.jpg"
  },
  {
    id: 12,
    brand: "Macbook",
    title: "Macbook 16 /32G /1TB - Advanced OLED Visual Elegance",
    subtext: "Featuring bright HDR standard screens and quick multi-core cooling systems.",
    price: 680,
    image:  "images/m8.jpg"
  },
];

// Application State Management
let currentCategory = "all";
let searchQuery = "";
let cartCount = 0;

// DOM Elements
const productsGrid = document.getElementById("products-grid");
const searchInput = document.getElementById("search-input");
const cartBadge = document.getElementById("cart-badge");
const categoryCards = document.querySelectorAll(".category-card");
const scrollRightBtn = document.getElementById("scroll-right-btn");
const categoriesContainer = document.getElementById("categories-container");
const cartToast = document.getElementById("cart-toast");

// Initialize Page Content
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  setupEventListeners();
});

// Render Products Grid based on current filters (search and category)
function renderProducts() {
  productsGrid.innerHTML = "";

  const filteredProducts = products.filter(product => {
    // Category match
    const categoryMatch = currentCategory === "all" || product.brand.toLowerCase() === currentCategory.toLowerCase();
    
    // Search query match
    const searchMatch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        product.subtext.toLowerCase().includes(searchQuery.toLowerCase());
                        
    return categoryMatch && searchMatch;
  });

  if (filteredProducts.length === 0) {
    productsGrid.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="bi bi-search" style="font-size: 3rem; color: #ccc;"></i>
        <h4 class="mt-3 text-muted">No products found</h4>
        <p class="text-muted">Try clearing your filters or testing another brand.</p>
      </div>
    `;
    return;
  }

  filteredProducts.forEach(product => {
    const cardHTML = `
      <div class="col-12 col-md-6 col-lg-4 mb-4">
        <div class="product-card" data-aos="fade-up">
          <div class="product-img-wrapper">
            <img src="${product.image}" alt="${product.title}" onerror="this.src='https://placehold.co/300x200?text=Laptop'">
          </div>
          <div class="product-info">
            <h5 class="product-title" title="${product.title}">${product.title}</h5>
            <p class="product-subtext" title="${product.subtext}">${product.subtext}</p>
            <div class="product-footer">
              <span class="product-price">${product.price}$</span>
              <button class="shop-btn btn-add-cart" data-id="${product.id}">Shop</button>
            </div>
          </div>
        </div>
      </div>
    `;
    productsGrid.insertAdjacentHTML("beforeend", cardHTML);
  });

  // Re-attach add to cart listeners
  document.querySelectorAll(".btn-add-cart").forEach(button => {
    button.addEventListener("click", handleAddToCart);
  });
}

// Setup Event Handlers
function setupEventListeners() {
  // Search Input Handler
  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    renderProducts();
  });

  // Category Cards Click Handlers
  categoryCards.forEach(card => {
    card.addEventListener("click", () => {
      // Toggle active states
      categoryCards.forEach(c => c.classList.remove("active"));
      card.classList.add("active");

      currentCategory = card.getAttribute("data-category");
      renderProducts();
    });
  });

  // Category Horizon Scroll Button
  scrollRightBtn.addEventListener("click", () => {
    categoriesContainer.scrollBy({
      left: 200,
      behavior: "smooth"
    });
  });

  // Basic contact form alert
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Thank you for contacting CP-Shop! We will reply to your inquiry shortly.");
      contactForm.reset();
    });
  }
}

// Add Item to Cart and show interactive Toast Notification
function handleAddToCart(e) {
  const productId = parseInt(e.target.getAttribute("data-id"));
  const product = products.find(p => p.id === productId);

  if (product) {
    cartCount++;
    cartBadge.textContent = cartCount;
    cartBadge.classList.remove("d-none"); // make sure badge is visible

    // Show custom Toast Notification
    cartToast.textContent = `Added "${product.brand}" to your cart!`;
    cartToast.style.display = "block";
    
    // Auto fadeout after 2 seconds
    setTimeout(() => {
      cartToast.style.display = "none";
    }, 2000);
  }
}


