const listEl = document.getElementById("leftsidebar-menu");
const plantContainer = document.getElementById("plant-container");
const cartList = document.getElementById("cart-list");
const cartTotalEl = document.getElementById("cart-total"); 
const spinner = document.getElementById("loading-spinner"); 
    
let cart = [];
let plantsData = [];

const loadPlants = async () => {
  try {
    const res = await fetch("https://openapi.programming-hero.com/api/plants");
    const json = await res.json();
    plantsData = json.plants || [];
    showPlants("All Trees"); 
  } catch (err) {
    plantContainer.innerHTML = `<p class="text-red-600">Error loading plants.</p>`;
    console.error(err);
  }
};

const showPlants = (categoryName) => {
  spinner.classList.remove("hidden");
  plantContainer.classList.add("hidden");

  setTimeout(() => {
    plantContainer.innerHTML = "";
    const filtered = categoryName === "All Trees" 
      ? plantsData 
      : plantsData.filter(p => p.category === categoryName);
  
    if (!filtered.length) {
      plantContainer.innerHTML = `<p class="text-gray-600">No plants in this category.</p>`;
      spinner.classList.add("hidden");
      plantContainer.classList.remove("hidden");
      return;
    }

    filtered.forEach(plant => {
      const card = document.createElement("div");
      card.className = "bg-white rounded-lg overflow-hidden flex flex-col";
  
      card.innerHTML = `
        <div class="p-4">
          <img src="${plant.image}" alt="${plant.name}" class="h-48 w-full object-cover rounded-lg">
        </div>
        <div class="p-4 flex flex-col flex-1">
          <h3 class="font-bold text-lg cursor-pointer text-black-800 ">${plant.name}</h3>
          <p class="text-gray-600 text-sm flex-1 mt-1">${plant.description}</p>
          <div class="flex justify-between mt-2 text-gray-500 text-sm">
            <button class="rounded-full bg-green-100 px-2 py-0.5 ">
              <span class="text-sm font-bold text-green-800">${plant.category}</span>
            </button>
            <a class="font-bold text-black-700">৳${plant.price}</a>
          </div>
          <button class="mt-3 bg-green-800 text-white py-2 rounded-full hover:bg-green-700 transition">Add to Cart</button>
        </div>
      `;

      card.querySelector("h3").addEventListener("click", () => openPlantModal(plant.id));

      card.querySelector("button.mt-3").addEventListener("click", () => {
        const confirmed = confirm(`${plant.name} has been added to the cart.`);
        if (confirmed) {
          cart.push(plant);
          renderCart();
        }
      });

      plantContainer.appendChild(card);
    });

    spinner.classList.add("hidden");
    plantContainer.classList.remove("hidden");
  }, 600);
};

const loadLeftSidebar = async () => {
  try {
    const res = await fetch("https://openapi.programming-hero.com/api/categories");
    const json = await res.json();
    const categories = json.categories || [];
    listEl.innerHTML = "";
    const createLi = (text, isActive = false) => {
      const li = document.createElement("li");
      li.className = `px-3 py-1.5 rounded-lg cursor-pointer transition text-sm ${
        isActive ? "bg-green-800 text-white" : "hover:bg-green-800 hover:text-white"
      }`;
      li.textContent = text;
      li.addEventListener("click", () => {
        listEl.querySelectorAll("li").forEach(item => {
          item.classList.remove("bg-green-800", "text-white");
          item.classList.add("hover:bg-green-800", "hover:text-white");
        });
        li.classList.add("bg-green-800", "text-white");
        li.classList.remove("hover:bg-green-800", "hover:text-white");
        showPlants(text); 
      });
      return li;
    };
    listEl.appendChild(createLi("All Trees", true));
    categories.forEach(cat => {
      listEl.appendChild(createLi(cat.category_name));
    });
  } catch (error) {
    listEl.innerHTML = `<li class="text-sm text-red-600">Error loading categories.</li>`;
    console.error(error);
  }
};

loadPlants();
loadLeftSidebar();

const modal = document.getElementById("plant-modal");
const modalName = document.getElementById("modal-name");
const modalImage = document.getElementById("modal-image");
const modalCategory = document.getElementById("modal-category");
const modalPrice = document.getElementById("modal-price");
const modalDescription = document.getElementById("modal-description");
const closeModal = document.getElementById("close-modal");

const openPlantModal = async (id) => {
  if (!id) return;
  try {
    const res = await fetch(`https://openapi.programming-hero.com/api/plant/${id}`);
    const data = await res.json();
    if (!data.status) throw new Error("Plant data not found");
    const plant = data.plants;
    modalName.textContent = plant.name;
    modalImage.src = plant.image;
    modalImage.alt = plant.name;
    modalCategory.innerHTML = `<strong>Category:</strong> ${plant.category}`;
    modalPrice.innerHTML = `<strong>Price:</strong> ৳${plant.price}`;
    modalDescription.innerHTML = `<strong>Description:</strong> ${plant.description}`;
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  } catch (err) {
    modalDescription.textContent = "Failed to load plant data.";
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    console.error(err);
  }
};

closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
  modal.classList.remove("flex");
});

function renderCart() {
  cartList.innerHTML = "";
  let total = 0;
  cart.forEach((item, index) => {
    total += item.price;
    const li = document.createElement("li");
    li.className = "flex justify-between items-center p-2 bg-green-50 rounded";
    li.innerHTML = `
      <div>
        <p class="font-semibold">${item.name}</p>
        <p class="text-gray-600">৳${item.price} × 1</p>
      </div>
      <button class="text-gray-600 font-bold ml-2">
        <i class="fas fa-times"></i>
      </button>
    `;
    li.querySelector("button").addEventListener("click", () => {
      cart.splice(index, 1);
      renderCart();
    });
    cartList.appendChild(li);
  });
  cartTotalEl.textContent = `৳${total}`;
}
