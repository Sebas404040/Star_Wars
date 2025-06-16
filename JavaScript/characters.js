class characters_StarWars extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.renderCharacters();
    }

    async renderCharacters() {
        try {
            const response = await fetch("../JSON/characters.json"); 
            const characters_data = await response.json();

            const characters = document.createElement("section");
            characters.id = "characters";

            characters_data.forEach(character => {
                const character_SW = document.createElement("section");
                character_SW.classList.add("Personaje");

                const link = document.createElement("a");
                link.href = "#";

                const img = document.createElement("img");
                img.src = character.imagen;
                img.alt = character.nombre;
                img.classList.add("imagen_personajes");

                const character_info = document.createElement("div");
                character_info.classList.add("Personajes_descripcion");

                const nombre_character = document.createElement("h3");
                nombre_character.textContent = character.nombre;

                const descripcion = document.createElement("p");
                descripcion.textContent = character.descripcion;

                link.appendChild(img);
                character_info.appendChild(nombre_character);
                character_info.appendChild(descripcion);
                character_SW.appendChild(link);
                character_SW.appendChild(character_info);
                characters.appendChild(character_SW);
            });

            this.appendChild(characters); 
        } catch (error) {
            console.error("Error en la obtención de datos:", error);
        }
    }
}

customElements.define("characters-sw", characters_StarWars);
