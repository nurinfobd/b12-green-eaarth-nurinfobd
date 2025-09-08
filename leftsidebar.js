const listEl = document.getElementById("leftsidebar-menu");
const plantContainer = document.getElementById("plant-container");

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
          plantContainer.innerHTML = "";
          const filtered = categoryName === "All Trees" 
            ? plantsData 
            : plantsData.filter(p => p.category === categoryName);
        
          if (!filtered.length) {
            plantContainer.innerHTML = `<p class="text-gray-600">No plants in this category.</p>`;
            return;
          }
      
          filtered.forEach(plant => {
            const card = document.createElement("div");
            card.className = "bg-white  rounded-lg overflow-hidden flex flex-col";
        
            card.innerHTML = `
                    <div class="p-4">
                        <img src="${plant.image}" alt="${plant.name}" class="h-48 w-full object-cover rounded-lg">
                    </div>

                    <div class="p-4 flex flex-col flex-1">
                        <h3 class="font-bold text-lg">${plant.name}</h3>
                        <p class="text-gray-600 text-sm flex-1 mt-1">${plant.description}</p>
                        <div class="flex justify-between mt-2 text-gray-500 text-sm">
                            <button class=" rounded-full bg-green-100 px-2 py-0.5 ">
                                <span class="text-sm font-bold text-green-800">${plant.category}</span>
                            </button>
                            <a class="font-bold text-black-700">৳${plant.price}</a>

                        </div>
                        <button class="mt-3 bg-green-800 text-white py-2 rounded-full hover:bg-green-700 transition">Add to Cart</button>
                    </div>
                `;
                plantContainer.appendChild(card);
             });
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
