class ships_StarWars extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.renderShips();
    }

    async renderShips() {
        try {
            const response = await fetch("../JSON/ships.json"); 
            const ships_data = await response.json();

            const ships = document.createElement("section");
            ships.id = "naves";

            ships_data.forEach(nave => {
                const ship_SW = document.createElement("div");
                ship_SW.classList.add("nave");

                const link = document.createElement("a");
                link.href = "#";

                const img = document.createElement("img");
                img.src = nave.imagen;
                img.alt = nave.nombre;
                img.classList.add("imagen_naves");

                const ship_info = document.createElement("section");
                ship_info.classList.add("descripcion_nave");

                const nombre_nave = document.createElement("h3");
                nombre_nave.textContent = nave.nombre;

                const descripcion = document.createElement("p");
                descripcion.textContent = nave.descripcion;

                link.appendChild(img);
                ship_info.appendChild(nombre_nave);
                ship_info.appendChild(descripcion);
                ship_SW.appendChild(link);
                ship_SW.appendChild(ship_info);
                ships.appendChild(ship_SW);
            });

            this.appendChild(ships); 
        } catch (error) {
            console.error("Error en la obtención de datos:", error);
        }
    }
}

customElements.define("ships-sw", ships_StarWars);