const listEl = document.getElementById("leftsidebar-menu");

const loadLeftSidebar = async () => {
  if (!listEl) return;

  try {
    const res = await fetch("https://openapi.programming-hero.com/api/categories");
    const json = await res.json();

    const categories = json.categories || []; 

    listEl.innerHTML = ""; 


    const createLi = (text, isActive = false) => {
      const li = document.createElement("li");
      li.className = `px-3 py-1.5 rounded-lg cursor-pointer transition text-sm ${
        isActive ? "bg-green-800 text-white " : "hover:bg-green-800 hover:text-white"
      }`;
      li.textContent = text;

      li.addEventListener("click", () => {
        listEl.querySelectorAll("li").forEach(item => {
          item.classList.remove("bg-green-800", "text-white");
          item.classList.add("hover:bg-green-800", "hover:text-white");
        });

        li.classList.add("bg-green-800", "text-white");
        li.classList.remove("hover:bg-green-800", "hover:text-white");
      });

      return li;
    };

    const allLi = createLi("All Trees", true);
    listEl.appendChild(allLi);

    categories.forEach(cat => {
      const li = createLi(cat.category_name);
      listEl.appendChild(li);
    });

  } catch (error) {
    listEl.innerHTML = `<li class="text-sm text-red-600">Error loading categories.</li>`;
    console.error(error);
  }
};

loadLeftSidebar();
