/*

const watchElement = descriptionDoc.querySelectorAll("p")[1];
const watchedOn = watchElement ? watchElement.textContent : null;

fetchMovieImage(latestItem.querySelector("movieId").textContent);

function fetchMovieImage(filmID) {

    const apiKey = "002afdd39f03ce14d240e374822f6600"
    fetch(`https://api.themoviedb.org/3/movie/${filmID}?api_key=${apiKey}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok " + response.statusText);
            }
            return response.json();
        })
        .then(data => {

            const baseUrl = "https://image.tmdb.org/t/p/original";
            const backdropPath = data.backdrop_path;

            if (backdropPath) {
                const imageUrl = baseUrl + backdropPath;
                document.getElementById("movie-image").src = imageUrl;
            } else {
                console.error("Backdrop image not found");
            }
        })
        .catch(error => {
            console.error("Error fetching movie details:", error);
        });
}

*/