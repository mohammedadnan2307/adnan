function openNav() {
    if ((screen.width >= 768) && (screen.width <= 1300)) {
        document.getElementById("myNav").style.width = "50%";
    }
    else {
        document.getElementById("myNav").style.width = "100%";
    }
}
function closeNav() {
    document.getElementById("myNav").style.width = "0%";
}
async function preFetchLatestLetterboxdFeed() {
    try {

        const feedUrl = encodeURIComponent("https://letterboxd.com/adnan2307/rss/");
        const proxyUrl = `https://cors-proxy-adnan.glitch.me/proxy?url=${feedUrl}`;
        await fetch(proxyUrl);
    } catch (error) {
        console.error("Error fetching the RSS feed:", error);
    }
}
preFetchLatestLetterboxdFeed();