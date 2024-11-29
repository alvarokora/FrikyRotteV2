export interface MovieDetail {
    title: string;             // Título de la película
    release_date: string;      // Fecha de estreno
    overview: string;          // Descripción/Resumen de la película
    poster_path: string;       // Ruta de la imagen del poster
    id: number;                // ID único de la película (de la API)
    genres: { id: number, name: string }[];  // Ejemplo: géneros de la película
    runtime: number;           // Duración de la película en minutos
    vote_average: number;      // Promedio de votación
    backdrop_path: string;     // Fondo de la película (imagen)
    // Agrega cualquier otra propiedad que necesites de la respuesta de TMDb
}
