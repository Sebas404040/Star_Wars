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
  
        characters_data.forEach((character, index) => {
          const character_SW = document.createElement("section");
          character_SW.classList.add("Personaje");
  
          const characterId = character.id || `dynamic-${index}`;
  
          const link = document.createElement("a");
          link.href = `./Character_SWinfo.html?id=${characterId}`; 
  
          const img = document.createElement("img");
          img.src = character.imagen || "../characters/default.png"; 
          img.alt = character.nombre || "Personaje desconocido";
          img.classList.add("imagen_personajes");
  
          const character_info = document.createElement("div");
          character_info.classList.add("Personajes_descripcion");
  
          const nombre_character = document.createElement("h3");
          nombre_character.textContent = character.nombre || "Nombre no disponible";
  
          const descripcion = document.createElement("p");
          descripcion.textContent = character.descripcion || "Descripción no disponible";
  
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
        let personaje = null;
  
        // api de star wars, uso
        const apiResponse = await fetch(`https://www.swapi.tech/api/people/${idPersonaje}`);
        if (apiResponse.ok) {
          const apiData = await apiResponse.json();
          personaje = apiData.result.properties;
  
      
          document.querySelector("#nombre_personaje").textContent = personaje.name || "Nombre no disponible";
  
      
          const biografiaContainer = document.querySelector("#biografia_personaje");
          biografiaContainer.textContent = ""; 
  
          biografiaContainer.appendChild(createInfoParagraph("Altura", personaje.height || "Altura no disponible"));
          biografiaContainer.appendChild(createInfoParagraph("Peso", personaje.mass || "Peso no disponible"));
          biografiaContainer.appendChild(createInfoParagraph("Color de cabello", personaje.hair_color || "Color de cabello no disponible"));
          biografiaContainer.appendChild(createInfoParagraph("Color de piel", personaje.skin_color || "Color de piel no disponible"));
          biografiaContainer.appendChild(createInfoParagraph("Color de ojos", personaje.eye_color || "Color de ojos no disponible"));
          biografiaContainer.appendChild(createInfoParagraph("Año de nacimiento", personaje.birth_year || "Año de nacimiento no disponible"));
          biografiaContainer.appendChild(createInfoParagraph("Género", personaje.gender || "Género no disponible"));
  
          // Mostrar imagen del personaje desde el archivo local si está disponible (ERROR del CRITICAL FIx)
          const localResponse = await fetch("../JSON/characters.json");
          const localData = await localResponse.json();
          const personajeLocal = localData.find((character) => character.id == idPersonaje);
  
          if (personajeLocal && personajeLocal.imagen) {
            document.querySelector(".imagen_personaje_info").src = personajeLocal.imagen;
          } else {
            document.querySelector(".imagen_personaje_info").src = "../characters/default.png"; // Imagen predeterminada por si no aparece la de la api 
          }
  
          
          const statsDiv = document.querySelector("#stats");
          if (statsDiv && personajeLocal && personajeLocal.stats) {
            statsDiv.textContent = "";
  
            const statMap = [
              { key: "poder_fuerza", label: "Poder en la fuerza", color: "#00bfff" },
              { key: "nivel_amenaza", label: "Nivel de amenaza", color: "#ff4b4b" },
              { key: "dominio_sable_laser", label: "Dominio del sable láser", color: "#00ff00" },
              { key: "estrategia_tactica", label: "Estrategia táctica", color: "#ffa500" }
            ];
  
            statMap.forEach(stat => {
              const value = personajeLocal.stats[stat.key] || "0%";
  
              const statSection = document.createElement("div");
              statSection.className = "stat";
  
              const span = document.createElement("span");
              span.textContent = stat.label;
  
              const barContainer = document.createElement("div");
              barContainer.className = "bar-container";
  
              const bar = document.createElement("div");
              bar.className = "bar";
              bar.style.width = value;
              bar.style.backgroundColor = stat.color;
  
              barContainer.appendChild(bar);
              statSection.appendChild(span);
              statSection.appendChild(barContainer);
  
              statsDiv.appendChild(statSection);
            });
          }
        } else {
          console.warn(`Personaje no encontrado en la API: ${apiResponse.status}`);
        }
  
        // Si no se encuentra en la API, buscar en el archivo local
        if (!personaje) {
          const localResponse = await fetch("../JSON/characters.json");
          const localData = await localResponse.json();
          const personajeLocal = localData.find((character) => character.id == idPersonaje);
  
          if (personajeLocal) {
            personaje = personajeLocal;
  
            // Mostrar nombre del personaje
            document.querySelector("#nombre_personaje").textContent = personajeLocal.nombre || "Nombre no disponible";
  
            
            const biografiaContainer = document.querySelector("#biografia_personaje");
            biografiaContainer.textContent = ""; 
  
            biografiaContainer.appendChild(createInfoParagraph("Altura", personajeLocal.altura || "Altura no disponible"));
            biografiaContainer.appendChild(createInfoParagraph("Peso", personajeLocal.peso || "Peso no disponible"));
            biografiaContainer.appendChild(createInfoParagraph("Color de cabello", personajeLocal.color_cabello || "Color de cabello no disponible"));
            biografiaContainer.appendChild(createInfoParagraph("Color de piel", personajeLocal.color_piel || "Color de piel no disponible"));
            biografiaContainer.appendChild(createInfoParagraph("Color de ojos", personajeLocal.color_ojos || "Color de ojos no disponible"));
            biografiaContainer.appendChild(createInfoParagraph("Año de nacimiento", personajeLocal.anio_nacimiento || "Año de nacimiento no disponible"));
            biografiaContainer.appendChild(createInfoParagraph("Género", personajeLocal.genero || "Género no disponible"));
  
          
            document.querySelector(".imagen_personaje_info").src = personajeLocal.imagen || "../characters/default.png";
  
            // Mostrar estadísticas en barras
            const statsDiv = document.querySelector("#stats");
            if (statsDiv && personajeLocal.stats) {
              statsDiv.textContent = ""; 
  
              const statMap = [
                { key: "poder_fuerza", label: "Poder en la fuerza", color: "#00bfff" },
                { key: "nivel_amenaza", label: "Nivel de amenaza", color: "#ff4b4b" },
                { key: "dominio_sable_laser", label: "Dominio del sable láser", color: "#00ff00" },
                { key: "estrategia_tactica", label: "Estrategia táctica", color: "#ffa500" }
              ];
  
              statMap.forEach(stat => {
                const value = personajeLocal.stats[stat.key] || "0%";
  
                const statSection = document.createElement("div");
                statSection.className = "stat";
  
                const span = document.createElement("span");
                span.textContent = stat.label;
  
                const barContainer = document.createElement("div");
                barContainer.className = "bar-container";
  
                const bar = document.createElement("div");
                bar.className = "bar";
                bar.style.width = value;
                bar.style.backgroundColor = stat.color;
  
                barContainer.appendChild(bar);
                statSection.appendChild(span);
                statSection.appendChild(barContainer);
  
                statsDiv.appendChild(statSection);
              });
            }
          } else {
            console.error("Personaje no encontrado en el archivo local.");
          }
        }
      } catch (error) {
        console.error("Error al obtener la información del personaje:", error);
      }
    } else {
      console.error("No se proporcionó un ID de personaje en la URL");
    }
  
    function createInfoParagraph(label, value) {
      const p = document.createElement("p");
      const strong = document.createElement("strong");
      strong.textContent = `${label}: `;
      p.appendChild(strong);
      p.append(value);
      return p;
    }
  });
