class MoviesStarWars extends HTMLElement {
    constructor() {
        super();
        this.moviesData = [];
    }

    connectedCallback() {
        this.renderMovies();
    }

    async renderMovies() {
        try {
            const response = await fetch("../JSON/movies.json");
            this.moviesData = await response.json();

            const grid = document.createElement("section");
            grid.id = "peliculas"; // 

            this.moviesData.forEach((movie, index) => {
                const card = document.createElement("div");
                card.className = "pelicula"; 

                const link = document.createElement("a");
                link.href = `./movie_info.html?id=${index + 1}`; 

                const image = document.createElement("img");
                image.src = movie.imagen || "../Movies/default.png";
                image.alt = movie.nombre;
                image.className = "imagen_peliculas"; 

                const title = document.createElement("h3");
                title.textContent = `${movie.nombre} (${movie.year})`;

                link.appendChild(image);
                card.appendChild(link);
                card.appendChild(title);
                grid.appendChild(card);
            });

            this.innerHTML = "";
            this.appendChild(grid);
        } catch (error) {
            console.error("Error al cargar películas:", error);
        }
    }
}

customElements.define("movies-sw", MoviesStarWars);

document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const movieId = params.get("id");

    if (!movieId) return;

    const image = document.querySelector("#imagen_descripcion_pelicula");
    const titleSection = document.querySelector(".titulo_pelicula h3");
    const description = document.querySelector("#descripcionInfo_pelicula");

    try {
  
        const localRes = await fetch("../JSON/movies.json");
        const localData = await localRes.json();
        const movieLocal = localData.find(m => m.id == movieId);
        if (movieLocal) {
            image.src = movieLocal.imagen || "../Movies/default.png";
            titleSection.textContent = `${movieLocal.nombre} (${movieLocal.year})`;
        }

        const apiRes = await fetch(`https://www.swapi.tech/api/films/${movieId}`);
        if (!apiRes.ok) {
            const fallback = document.createElement("p");
            fallback.textContent = "No se pudo obtener información desde la API.";
            description.appendChild(fallback);
            return;
        }

        const apiData = await apiRes.json();
        const props = apiData.result.properties;


        description.appendChild(createInfoParagraph("Título original", props.title));
        description.appendChild(createInfoParagraph("Director", props.director));
        description.appendChild(createInfoParagraph("Productor", props.producer));
        description.appendChild(createInfoParagraph("Fecha de estreno", props.release_date));
        description.appendChild(createInfoParagraph("Sinopsis", props.opening_crawl));

    } catch (error) {
        console.error("Error al mostrar detalles de la película:", error);
        const errorText = document.createElement("p");
        errorText.textContent = "Error al cargar los datos.";
        description.appendChild(errorText);
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

