const movies = [];

async function fetchLatestLetterboxdFeed() {
    try {

        const feedUrl = encodeURIComponent("https://letterboxd.com/adnan2307/rss/");
        const proxyUrl = `https://cors-proxy-three-liart.vercel.app/api/proxy?url=${feedUrl}`;
        
        const response = await fetch(proxyUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const rssText = await response.text();

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(rssText, "application/xml");

        const items = xmlDoc.querySelectorAll("item");
        const numberOfItems = Math.min(5, items.length);

        for (let i = 0; i < numberOfItems; i++) {
            const item = items[i];

            let link = item.querySelector("link").textContent;
            link = reduceRewatches(link.replace("/adnan2307", ""));

            const description = item.querySelector("description").textContent;
            const descriptionDoc = new DOMParser().parseFromString(description, "text/html");
            const imgElement = descriptionDoc.querySelector("img");
            const imgURL = imgElement ? imgElement.src : null;

            // Extract movie title from the link for alt text
            const titleMatch = link.match(/\/film\/([^/]+)/);
            const movieTitle = titleMatch ? titleMatch[1].replace(/-/g, ' ') : `Movie ${i + 1}`;

            movies.push({
                id: i,
                movieLink: link,
                imgSrc: imgURL,
                title: movieTitle,
            });
        }

        renderCarouselItems();

    } catch (error) {
        console.error("Error fetching or parsing the RSS feed:", error);
    }
}

function reduceRewatches(link) {
    const parts = link.split('/');
    if (parts.length <= 5) {
        return link;
    }
    return parts.slice(0, 5).join('/');
}

function renderCarouselItems() {
    const carouselItems = movies.map((movie) => {
        return React.createElement("div", { className: "carousel-item", key: movie.id },
            React.createElement("a", { href: movie.movieLink },
                React.createElement("img", {
                    className: "carousel-item-img",
                    src: movie.imgSrc,
                    alt: movie.title,
                    loading: "lazy",
                })
            )
        );
    });

    ReactDOM.render(
        React.createElement("div", { className: "carousel-container" }, ...carouselItems),
        document.getElementById("root")
    );
}

fetchLatestLetterboxdFeed();
