// Product Detail Logic for CP-Shop
// Handles loading product details from query string, rendering, and related products list.

const allProducts = [
  // General & HP (from script.js / product-page.js)
  { id: 1, brand: "MacBook", title: "MacBook Pro 14 - Advanced M3 Chip Performance", subtext: "Designed for developers, creators, and professionals needing ultimate battery life.", price: 1290, image: "images/p1.jpg" },
  { id: 2, brand: "Dell", title: "Dell XPS 13 - Advanced AI Performance & Battery Life", subtext: "Available on select Snapdragon X Series and Intel Core Ultra processors.", price: 999, image: "images/p2.jpg" },
  { id: 3, brand: "HP", title: "HP Spectre x360 - 2-in-1 Convertible Elite Specs", subtext: "Designed with AI-driven smart features and premium metal finish options.", price: 850, image: "images/p3.jpg" },
  { id: 4, brand: "MacBook", title: "MacBook Air 13\" - Ultra thin with M3 Power", subtext: "Superlight and fast. Ideal for students and on-the-go productivity.", price: 799, image: "images/p4.jpg" },
  { id: 5, brand: "Dell", title: "Dell Inspiron 15 - Daily Study and Homework Assistant", subtext: "Equipped with fast charging options and anti-glare screen display panels.", price: 450, image: "images/p5.jpg" },
  { id: 6, brand: "HP", title: "HP Pavilion Plus 14 - Advanced OLED Visual Elegance", subtext: "Featuring bright HDR standard screens and quick multi-core cooling systems.", price: 680, image: "images/p6.jpg" },
  { id: 7, brand: "MacBook", title: "MacBook Air 13\" - Ultra thin with M3 Power", subtext: "Superlight and fast. Ideal for students and on-the-go productivity.", price: 799, image: "images/m2.jpg" },
  { id: 8, brand: "Dell", title: "Dell Inspiron 15 - Daily Study and Homework Assistant", subtext: "Equipped with fast charging options and anti-glare screen display panels.", price: 450, image: "images/d5.jpg" },
  { id: 9, brand: "HP", title: "HP Pavilion Plus 14 - Advanced OLED Visual Elegance", subtext: "Featuring bright HDR standard screens and quick multi-core cooling systems.", price: 680, image: "images/m6.jpg" },
  
  // Dell specific (from dell.js)
  { id: 1, brand: "dell", title: "Dell Pro 14\" - Advanced M3 Chip Performance", subtext: "Designed for developers, creators, and professionals needing ultimate battery life.", price: 1290, image: "images/d1.jpg" },
  { id: 2, brand: "dell", title: "Dell Air 13,6 -24 GB RAM /1TB/ ", subtext: "Designed for developers, creators, and professionals needing ultimate battery life", price: 2099, image: "images/d2.jpg" },
  { id: 3, brand: "dell", title: "Dell 14,6 -32 GB RAM ", subtext: "Designed for developers, creators, and professionals needing ultimate battery life", price: 850, image: "images/d3.jpg" },
  { id: 4, brand: "dell", title: "dell latitude 7480", subtext: "Superlight and fast. Ideal for students and on-the-go productivity.", price: 799, image: "images/d4.jpg" },
  { id: 5, brand: "dell", title: "Dell Inspiron 15 - Daily Study and Homework Assistant", subtext: "Equipped with fast charging options and anti-glare screen display panels.", price: 450, image: "images/d5.jpg" },
  { id: 6, brand: "dell", title: "Dell Pavilion Plus 14", subtext: "Featuring bright HDR standard screens and quick multi-core cooling systems.", price: 680, image: "images/p5.jpg" },
  { id: 7, brand: "dell", title: "Dell XPS ", subtext: "Superlight and fast. Ideal for students and on-the-go productivity.", price: 799, image: "images/p2.jpg" },
  { id: 8, brand: "dell", title: "Dell Inspiron 15 - Daily Study and Homework Assistant", subtext: "Equipped with fast charging options and anti-glare screen display panels.", price: 450, image: "images/p3.jpg" },
  { id: 9, brand: "dell", title: "DellPlus 14 - Advanced OLED Visual Elegance", subtext: "Featuring bright HDR standard screens and quick multi-core cooling systems.", price: 680, image: "images/d6.jpg" },
  { id: 10, brand: "dell", title: "DELL XPS 15 7590", subtext: "Superlight and fast. Ideal for students and on-the-go productivity.", price: 799, image: "images/d7.jpg" },
  { id: 11, brand: "dell", title: "Dell XPS 13 Plus boasts a 13-inch display with a 16:10 aspect ratio and UHD+ 4k+ resolution", subtext: "The XPS 13 Plus boasts a 13-inch display with a 16:10 aspect ratio and UHD+ 4k+ resolution, delivering high brightness, improved clarity, precise detail, and vivid colors.", price: 450, image: "images/d9.jpg" },
  { id: 13, brand: "dell", title: "Dell Unifies XPS Lineup with Sleek New AI-Powered XPS 14 and XPS 16 Laptops", subtext: "Featuring bright HDR standard screens and quick multi-core cooling systems.", price: 680, image: "images/d8.jpg" },

  // Macbook specific (from macbook.js)
  { id: 1, brand: "macbook", title: "MacBook Pro 14\" - Advanced M3 Chip Performance", subtext: "Designed for developers, creators, and professionals needing ultimate battery life.", price: 1290, image: "images/p1.jpg" },
  { id: 2, brand: "macbook", title: "Apple MacBook Air 13,6 -24 GB RAM /1TB/ ", subtext: "Designed for developers, creators, and professionals needing ultimate battery life", price: 2099, image: "images/m1.jpg" },
  { id: 3, brand: "macbook", title: "Apple MacBook Air 14,6 -32 GB RAM ", subtext: "Designed for developers, creators, and professionals needing ultimate battery life", price: 850, image: "images/m3.jpg" },
  { id: 4, brand: "macbook", title: "MacBook Air 13\" - Ultra thin with M3 Power", subtext: "Superlight and fast. Ideal for students and on-the-go productivity.", price: 799, image: "images/m6.jpg" },
  { id: 5, brand: "macbook", title: "Macbook 16inh - Daily Study and Homework Assistant", subtext: "Equipped with fast charging options and anti-glare screen display panels.", price: 450, image: "images/m5.jpg" },
  { id: 6, brand: "macbook", title: "Macbook Air Plus 14 - Advanced OLED Visual Elegance", subtext: "Featuring bright HDR standard screens and quick multi-core cooling systems.", price: 680, image: "images/m4.jpg" },
  { id: 7, brand: "macbook", title: "MacBook Air 13\" - Ultra thin with M3 Power", subtext: "Superlight and fast. Ideal for students and on-the-go productivity.", price: 799, image: "images/m4.jpg" },
  { id: 8, brand: "macbook", title: "Macbook pro Inspiron 15 - Daily Study and Homework Assistant", subtext: "Equipped with fast charging options and anti-glare screen display panels.", price: 450, image: "images/m9.jpg" },
  { id: 9, brand: "macbook", title: "Macbook pro /1TB - Advanced OLED Visual Elegance", subtext: "Featuring bright HDR standard screens and quick multi-core cooling systems.", price: 680, image: "images/m10.jpg" },
  { id: 10, brand: "macbook", title: "MacBook Air 13\" - Ultra thin with M3 Power", subtext: "Superlight and fast. Ideal for students and on-the-go productivity.", price: 799, image: "images/p4.jpg" },
  { id: 11, brand: "macbook", title: "MAcbook 14Pro  - Daily Study, Homework and develop code Assistant", subtext: "Equipped with fast charging options and anti-glare screen display panels.", price: 450, image: "images/m7.jpg" },
  { id: 12, brand: "macbook", title: "Macbook 16 /32G /1TB - Advanced OLED Visual Elegance", subtext: "Featuring bright HDR standard screens and quick multi-core cooling systems.", price: 680, image: "images/m8.jpg" },

  // Product page specific (from product-page.js)
  { id: 10, brand: "macbook", title: "Macbook Air2 ", subtext: "Equipped with fast charging options and anti-glare screen display panels.", price: 450, image: "images/m2.jpg" },
  { id: 12, brand: "macbook", title: "Macbook pro3 / 1TB", subtext: "Superlight and fast. Ideal for students and on-the-go productivity.", price: 680, image: "images/m10.jpg" },
  { id: 14, brand: "hp", title: "HP EliteBook 830 G8 Intel Core i5-1135G7 16GB RAM 512GB SSD 13.3", subtext: "Featuring bright HDR standard screens and quick multi-core cooling systems.", price: 680, image: "images/h2.jpg" },
  { id: 15, brand: "dell", title: "DellPlus 14 - Advanced OLED Visual Elegance", subtext: "Featuring bright HDR standard screens and quick multi-core cooling systems.", price: 680, image: "images/d6.jpg" }
];

window.getProductSpecs = function(product) {
  const brand = (product.brand || "").toLowerCase();
  if (brand === "macbook" || brand === "apple") {
    return [
      "RAM: 8GB / 16GB Unified Memory | SSD: 512GB / 1TB PCIe SSD",
      "- 14.2\" Liquid Retina XDR display (3024 x 1964) IPS",
      "- GPU: Apple M3 Chip 10-Core",
      "- Feature: Backlit Magic Keyboard with Touch ID",
      "- OS: macOS Sonoma",
      "- Battery: up to 18-22 hours of movie playback",
      "- Weight: 1.55Kg | Color: Space Gray / Silver",
      "- Code: AP-MBP14M3-01",
      "- Free: Premium Laptop Sleeve, Type-C Hub",
      "- Free: Cleaning Kit & Screen Protector"
    ];
  } else if (brand === "dell") {
    return [
      "RAM : DDR5 16GB | SSD : 1TB PCIe",
      "- 14 \" WUXGA (1920 x 1200) IPS",
      "- GPU : AMD Radeon™ Graphics",
      "- Feature : Backlit Chiclet Keyboard",
      "- OS : Windows 11 License",
      "- 50WHrs, 42WHrs, 3S1P, 3-cell Li-ion",
      "- Weight : 1.46Kg | Color : Platinum Gold",
      "- Code : L001-LY035WA3",
      "- Free : Bag, Wireless Mouse, Pad",
      "- Free : Cleaning Kit Water"
    ];
  } else {
    // HP or default
    return [
      "RAM: DDR5 16GB | SSD: 512GB PCIe NVMe SSD",
      "- 14\" WUXGA (1920 x 1200) Touchscreen IPS",
      "- GPU: Intel Iris Xe Graphics / Intel Arc Graphics",
      "- Feature: 360-degree Hinge, Backlit Keyboard, Pen Support",
      "- OS: Windows 11 License",
      "- Battery: 43WHrs / 50WHrs 3-cell Li-ion",
      "- Weight: 1.4Kg | Color: Natural Silver / Nightfall Black",
      "- Code: HP-SPEC360-03",
      "- Free: HP Sleeve, Wireless Mouse, Stylus Pen",
      "- Free: Cleaning Kit & Screen Protector"
    ];
  }
};

let selectedProduct = null;

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const brandParam = urlParams.get('brand');
  const idParam = parseInt(urlParams.get('id'));

  const loadingEl = document.getElementById("detail-loading");
  const contentEl = document.getElementById("detail-content");

  if (!brandParam || isNaN(idParam)) {
    showError("Invalid product link parameters.");
    return;
  }

  const titleParam = urlParams.get('title');

  // Exact matching by title first (avoids duplicate ID conflicts)
  if (titleParam) {
    selectedProduct = allProducts.find(p => p.title.trim().toLowerCase() === titleParam.trim().toLowerCase());
  }

  // Fallback: match by case-insensitive brand and matching ID
  if (!selectedProduct) {
    selectedProduct = allProducts.find(p => 
      p.brand.toLowerCase() === brandParam.toLowerCase() && 
      p.id === idParam
    );
  }

  // Second Fallback: match by brand only
  if (!selectedProduct && brandParam) {
    selectedProduct = allProducts.find(p => p.brand.toLowerCase() === brandParam.toLowerCase());
  }

  if (!selectedProduct) {
    showError("Product details could not be found. Please return to products page.");
    return;
  }

  // Hide loading spinner and show content
  if (loadingEl) loadingEl.classList.add("d-none");
  if (contentEl) contentEl.classList.remove("d-none");

  // Render content
  renderProductDetail(selectedProduct);
  renderRelatedProducts(selectedProduct);

  // Bind Add to Cart action
  const addCartBtn = document.getElementById("btn-detail-add-cart");
  if (addCartBtn) {
    addCartBtn.addEventListener("click", () => {
      if (selectedProduct) {
        window.addToCart(selectedProduct);
      }
    });
  }
});

function renderProductDetail(product) {
  document.getElementById("product-detail-img").src = product.image;
  document.getElementById("product-detail-img").alt = product.title;
  document.getElementById("product-detail-brand").textContent = product.brand;
  document.getElementById("product-detail-title").textContent = product.title;
  document.getElementById("product-detail-price").textContent = `${product.price}$`;
  document.getElementById("breadcrumb-active").textContent = product.title;
  document.title = `${product.title} - CP-Shop`;

  const specsList = document.getElementById("product-detail-specs");
  specsList.innerHTML = "";

  const specs = window.getProductSpecs(product);
  specs.forEach((spec, index) => {
    let text = spec;
    if (index > 0 && !text.startsWith("-")) {
      text = "- " + text;
    }
    const li = document.createElement("li");
    li.textContent = text;
    // Format the first item (RAM & SSD) with bold styling
    if (index === 0) {
      li.style.fontWeight = "bold";
      li.style.color = "var(--textContent)";
      li.style.fontSize = "1.05rem";
      li.style.marginBottom = "8px";
    }
    specsList.appendChild(li);
  });
}

function renderRelatedProducts(product) {
  const relatedGrid = document.getElementById("products-grid");
  if (!relatedGrid) return;
  relatedGrid.innerHTML = "";

  // Get other products of same brand, or similar products, excluding self
  let related = allProducts.filter(p => 
    p.brand.toLowerCase() === product.brand.toLowerCase() && 
    p.title !== product.title
  );

  // Remove duplicates by title
  const uniqueRelated = [];
  const titlesSeen = new Set();
  related.forEach(item => {
    if (!titlesSeen.has(item.title)) {
      titlesSeen.add(item.title);
      uniqueRelated.push(item);
    }
  });

  // Limit to 4 related products
  const displayProducts = uniqueRelated.slice(0, 4);

  if (displayProducts.length === 0) {
    document.getElementById("related-section").classList.add("d-none");
    return;
  }

  displayProducts.forEach(prod => {
    const detailURL = `product-detail.html?brand=${encodeURIComponent(prod.brand.toLowerCase())}&id=${prod.id}&title=${encodeURIComponent(prod.title)}`;

    const cardHTML = `
      <div class="col-12 col-md-6 col-lg-3 mb-4">
        <div class="product-card" data-aos="fade-up">
          <a href="${detailURL}" class="product-card-link text-decoration-none text-dark">
            <div class="product-img-wrapper">
              <img src="${prod.image}" alt="${prod.title}" onerror="this.src='https://placehold.co/300x200?text=Laptop'">
            </div>
          </a>
          <div class="product-info">
            <a href="${detailURL}" class="product-card-link text-decoration-none text-dark">
              <h5 class="product-title" title="${prod.title}">${prod.title}</h5>
            </a>
            <a href="${detailURL}" class="product-card-link text-decoration-none text-dark">
              <p class="product-subtext" title="${prod.subtext}">${prod.subtext}</p>
            </a>
            <div class="product-footer">
              <span class="product-price">${prod.price}$</span>
              <button class="shop-btn btn-add-cart" data-id="${prod.id}">Shop</button>
            </div>
          </div>
        </div>
      </div>
    `;
    relatedGrid.insertAdjacentHTML("beforeend", cardHTML);
  });

  // Re-attach add to cart listeners for related items
  document.querySelectorAll(".btn-add-cart").forEach(button => {
    button.removeEventListener("click", handleAddToCartDetail); // prevent dupes
    button.addEventListener("click", handleAddToCartDetail);
  });
}

function handleAddToCartDetail(e) {
  const productId = parseInt(e.target.getAttribute("data-id"));
  const product = allProducts.find(p => p.id === productId);

  if (product) {
    window.addToCart(product);
  }
}

function showError(message) {
  const loadingEl = document.getElementById("detail-loading");
  if (loadingEl) {
    loadingEl.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="bi bi-exclamation-triangle text-danger" style="font-size: 3rem;"></i>
        <h4 class="mt-3 text-danger">Error Loading Details</h4>
        <p class="text-muted">${message}</p>
        <a href="product-page.html" class="btn btn-primary mt-3 rounded-pill px-4">Browse Laptops</a>
      </div>
    `;
  }
}
