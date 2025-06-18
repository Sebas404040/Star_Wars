class ships_StarWars extends HTMLElement {
    constructor() {
        super();
        this.shipsData = [];
    }

    connectedCallback() {
        this.renderShips();
        this.setupSearchAndFilter();
    }

    async renderShips(filteredData = null) {
        try {
            const localResponse = await fetch("../JSON/ships.json");
            this.shipsData = await localResponse.json();
            const dataToRender = filteredData || this.shipsData;

            const ships = document.createElement("section");
            ships.id = "naves";

            if (dataToRender.length === 0) {
                ships.innerHTML = `<div class="no-results">No se encontraron naves.</div>`;
            } else {
                dataToRender.forEach(nave => {
                    const shipCard = document.createElement("div");
                    shipCard.classList.add("nave");

                    const link = document.createElement("a");
                    link.href = `./Ship_SWinfo.html?id=${nave.id}`;

                    const img = document.createElement("img");
                    img.src = nave.imagen || "../ships/default.png";
                    img.alt = nave.nombre;
                    img.classList.add("imagen_naves");

                    const info = document.createElement("section");
                    info.classList.add("descripcion_nave");

                    const title = document.createElement("h3");
                    title.textContent = nave.nombre;

                    const desc = document.createElement("p");
                    desc.textContent = nave.descripcion;

                    link.appendChild(img);
                    info.appendChild(title);
                    info.appendChild(desc);
                    shipCard.appendChild(link);
                    shipCard.appendChild(info);
                    ships.appendChild(shipCard);
                });
            }

            this.innerHTML = "";
            this.appendChild(ships);
        } catch (error) {
            console.error("Error al renderizar naves:", error);
        }
    }

    setupSearchAndFilter() {
        const searchInput = document.querySelector(".Barra_busqueda");
        const filterButton = document.querySelector("#filtro_Star_Wars");
        const filterSelect = document.querySelector("#filtro_peliculas");

        if (!searchInput || !filterButton || !filterSelect) return;

        filterButton.addEventListener("click", () => {
            filterSelect.style.display = filterSelect.style.display === "none" ? "block" : "none";
        });

        searchInput.addEventListener("input", (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filtered = this.shipsData.filter(nave =>
                nave.nombre.toLowerCase().includes(searchTerm)
            );
            this.renderShips(filtered);
        });

        filterSelect.addEventListener("change", (e) => {
            const selectedMovie = e.target.value;
            const filtered = this.shipsData.filter(nave =>
                nave.peliculas && nave.peliculas.includes(selectedMovie)
            );
            this.renderShips(filtered);
        });
    }
}

customElements.define("ships-sw", ships_StarWars);


document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const idNave = params.get("id");

    if (!idNave) {
        console.error("No se proporcionó un ID de nave en la URL");
        return;
    }

    const statsContainer = document.querySelector("#stats_ships");
    statsContainer.innerHTML = ""; // ✅ Limpiar estadísticas previas

    try {
    // 🔗 1. INTENTAR obtener desde la API de Star Wars
    const apiResponse = await fetch(`https://www.swapi.tech/api/starships/${idNave}`);

    if (apiResponse.ok) {
        const apiData = await apiResponse.json();
        const naveAPI = apiData.result.properties;

        document.querySelector("h1").textContent = naveAPI.name || "Nombre no disponible";

        document.querySelector("#descripcion").textContent =
            `Fabricante: ${naveAPI.manufacturer || "N/A"}. Modelo: ${naveAPI.model || "N/A"}. Clase: ${naveAPI.starship_class || "N/A"}.`;

        renderBar("Velocidad máxima", naveAPI.max_atmosphering_speed || 0, 1500);
        renderBar("Blindaje", 70, 100);
        renderBar("Capacidad de carga", naveAPI.cargo_capacity || 0, 100000);
        renderBar("Armamento", 40, 100);

        // ✅ Obtener imagen desde el JSON local
        const localResponse = await fetch("../JSON/ships.json");
        const localData = await localResponse.json();
        const naveLocal = localData.find(n => n.id == idNave);

        if (naveLocal && naveLocal.imagen) {
            document.querySelector(".imagen_nave").src = naveLocal.imagen;
        } else {
            document.querySelector(".imagen_nave").src = "../ships/default.png";
        }

        return; // 🔚 Salir solo después de intentar imagen
    }

    // 🔄 2. SI NO EXISTE EN LA API o falla, buscar todo en archivo local
    const localResponse = await fetch("../JSON/ships.json");
    const localData = await localResponse.json();
    const naveLocal = localData.find(n => n.id == idNave);

    if (naveLocal) {
        document.querySelector("h1").textContent = naveLocal.nombre;
        document.querySelector("#descripcion").textContent = naveLocal.descripcion;
        document.querySelector(".imagen_nave").src = naveLocal.imagen || "../ships/default.png";

        const stats = naveLocal.stats || {};
        renderBar("Velocidad máxima", stats["Velocidad máxima"] || "0%", 100);
        renderBar("Blindaje", stats["Blindaje"] || "0%", 100);
        renderBar("Capacidad de carga", stats["Capacidad de carga"] || "0%", 100);
        renderBar("Armamento", stats["Armamento"] || "0%", 100);
    } else {
        console.warn("Nave no encontrada en archivo local.");
    }

} catch (error) {
    console.error("Error al obtener la información de la nave:", error);
}


    function renderBar(label, valor, max) {
        const section = document.createElement("div");
        section.className = "stat_ship";

        const span = document.createElement("span");
        span.textContent = `${label}:`;

        const barContainer = document.createElement("div");
        barContainer.className = "bar-container";

        const bar = document.createElement("div");
        bar.className = "bar";

        const porcentaje = typeof valor === "string" && valor.includes("%")
            ? valor
            : `${Math.min((valor / max) * 100, 100)}%`;

        bar.style.width = porcentaje;
        if (label === "Armamento") bar.style.backgroundColor = "#ff4b4b";

        barContainer.appendChild(bar);
        section.appendChild(span);
        section.appendChild(barContainer);
        statsContainer.appendChild(section);
    }
});
