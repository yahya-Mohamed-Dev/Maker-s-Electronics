const cartCount = document.querySelector("#cart-count");
const cartButton = document.querySelector("#cart-button");
const toast = document.querySelector("#toast-message");
const productCards = [...document.querySelectorAll(".product-card")];
let cartItems = 0;
let toastTimer;

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2400);
}

document.querySelectorAll(".quick-add").forEach((button) => {
    button.addEventListener("click", () => {
        cartItems += 1;
        cartCount.textContent = cartItems;
        cartButton.setAttribute("aria-label", `Shopping cart, ${cartItems} items`);
        showToast(`${button.dataset.product} added to your cart`);
    });
});

function filterProducts(category) {
    productCards.forEach((card) => {
        card.classList.toggle("is-hidden", category !== "all" && card.dataset.category !== category);
    });
    document.querySelectorAll(".filter-chip").forEach((button) => {
        button.classList.toggle("active", button.dataset.filter === category);
    });
}

document.querySelectorAll(".filter-chip").forEach((button) => {
    button.addEventListener("click", () => filterProducts(button.dataset.filter));
});

document.querySelectorAll(".category-tile").forEach((tile) => {
    tile.addEventListener("click", () => {
        const category = tile.dataset.filter;
        const availableFilter = document.querySelector(`.filter-chip[data-filter="${category}"]`);
        if (availableFilter) filterProducts(category);
    });
});

document.querySelector("#search-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const query = document.querySelector("#product-search").value.trim().toLowerCase();
    const matchingCards = productCards.filter((card) => card.textContent.toLowerCase().includes(query));
    productCards.forEach((card) => card.classList.toggle("is-hidden", Boolean(query) && !matchingCards.includes(card)));
    document.querySelectorAll(".filter-chip").forEach((button) => button.classList.remove("active"));
    if (query && matchingCards.length === 0) showToast("No matching products. Try another search.");
    else if (query) showToast(`${matchingCards.length} product${matchingCards.length === 1 ? "" : "s"} found`);
    else filterProducts("all");
    document.querySelector("#featured").scrollIntoView({ behavior: "smooth" });
});

document.querySelector("#newsletter-form").addEventListener("submit", (event) => {
    event.preventDefault();
    document.querySelector("#newsletter-message").textContent = "You're on the list. Watch your inbox.";
    document.querySelector("#email-input").value = "";
});

document.querySelector("#menu-toggle").addEventListener("click", (event) => {
    const button = event.currentTarget;
    const nav = document.querySelector("#category-nav");
    const isOpen = nav.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(isOpen));
    button.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    button.innerHTML = `<i class="bi bi-${isOpen ? "x-lg" : "list"}"></i>`;
});

const revealElements = document.querySelectorAll(
    ".category-section .section-heading, .category-tile, .featured-section .section-heading, .product-card, .project-section .section-heading, .project-card, .newsletter-inner > *"
);

revealElements.forEach((element, index) => {
    element.classList.add("reveal-on-scroll");
    element.style.setProperty("--reveal-delay", `${(index % 4) * 90}ms`);
});

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("animate__animated", "animate__fadeInUp", "is-revealed");
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -32px 0px" });

    revealElements.forEach((element) => revealObserver.observe(element));
} else {
    revealElements.forEach((element) => element.classList.add("is-revealed"));
}