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
  
        characters_data.forEach((character) => {
          const character_SW = document.createElement("section");
          character_SW.classList.add("Personaje");
  
          const link = document.createElement("a");
          link.href = `./Character_SWinfo.html?id=${character.id}`; 
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

  document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const idPersonaje = params.get("id");
  
    if (idPersonaje) {
      try {
        const response = await fetch(`https://www.swapi.tech/api/people/${idPersonaje}`);
        if (response.ok) {
          const data = await response.json();
          const personaje = data.result.properties;
  
          document.querySelector("#nombre_personaje").textContent = personaje.name;
          document.querySelector("#biografia_personaje").textContent = `
            Altura: ${personaje.height} cm
            Peso: ${personaje.mass} kg
            Color de cabello: ${personaje.hair_color}
            Color de piel: ${personaje.skin_color}
            Color de ojos: ${personaje.eye_color}
            Año de nacimiento: ${personaje.birth_year}
            Género: ${personaje.gender}
          `;
  
          const localResponse = await fetch("../JSON/characters.json");
          const localData = await localResponse.json();
          const personajeLocal = localData.find((character) => character.id == idPersonaje);
  
          if (personajeLocal) {
            document.querySelector(".imagen_personaje_info").src = personajeLocal.imagen;
          } else {
            document.querySelector(".imagen_personaje_info").src = "../characters/default.png"; 
          }
        } else {
          console.error("Personaje no encontrado en la API.");
        }
      } catch (error) {
        console.error("Error al obtener la información del personaje:", error);
      }
    } else {
      console.error("No se proporcionó un ID de personaje en la URL");
    }
  });
