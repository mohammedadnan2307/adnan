var movies = [];

async function fetchLatestLetterboxdFeed() {
    try {
        const proxyUrl = "https://d107bo5xeh82xz.cloudfront.net/";

        const response = await fetch(proxyUrl);
        const rssText = await response.text();

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(rssText, "application/xml");

        const items = xmlDoc.querySelectorAll("item");
        const numberOfItems = Math.min(10, items.length);

        for (let i = 0; i < numberOfItems; i++) {
            const item = items[i];

            var link = item.querySelector("link").textContent;
            link = reduceRewatches(link.replace("/adnan2307", ""));

            const description = item.querySelector("description").textContent;
            const descriptionDoc = new DOMParser().parseFromString(description, "text/html");
            const imgElement = descriptionDoc.querySelector("img");
            const imgURL = imgElement ? imgElement.src : null;

            movies.push({
                id: i,
                movieLink: link,
                imgSrc: imgURL
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
                    src: movie.imgSrc
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