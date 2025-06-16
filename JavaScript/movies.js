class movies_StarWars extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.renderMovies();
    }

    async renderMovies() {
        try {
            const response = await fetch("../JSON/movies.json"); 
            const movies_data = await response.json();

            const movies = document.createElement("section");
            movies.id = "peliculas";

            movies_data.forEach(movie => {
                const movie_SW = document.createElement("div");
                movie_SW.classList.add("pelicula");

                const link = document.createElement("a");
                link.href = "#";

                const img = document.createElement("img");
                img.src = movie.imagen;
                img.alt = movie.nombre;
                img.classList.add("imagen_peliculas");

                const movie_info = document.createElement("section");
                movie_info.classList.add("descripcion_pelicula");

                const nombre_movie = document.createElement("h3");
                nombre_movie.textContent = movie.nombre;

                const descripcion = document.createElement("p");
                descripcion.textContent = movie.descripcion;

                link.appendChild(img);
                movie_info.appendChild(nombre_movie);
                movie_info.appendChild(descripcion);
                movie_SW.appendChild(link);
                movie_SW.appendChild(movie_info);
                movies.appendChild(movie_SW);
            });

            this.appendChild(movies); 
        } catch (error) {
            console.error("Error en la obtención de datos:", error);
        }
    }
}

customElements.define("movies-sw", movies_StarWars);