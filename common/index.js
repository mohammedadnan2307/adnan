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

(function () {
    if (!window.chatbase || window.chatbase("getState") !== "initialized") {
        window.chatbase = (...arguments) => {
            if (!window.chatbase.q) {
                window.chatbase.q = []
            } window.chatbase.q.push(arguments)
        };
        window.chatbase = new Proxy(window.chatbase, { get(target, prop) { if (prop === "q") { return target.q } return (...args) => target(prop, ...args) } })
    }
    const onLoad = function () {
        const script = document.createElement("script");
        script.src = "https://www.chatbase.co/embed.min.js"; 
        script.id = "eLXEIZ4y2MoW--VGdKcas";
        script.domain = "www.chatbase.co";
        document.body.appendChild(script)
    }; if (document.readyState === "complete") { onLoad() } else { window.addEventListener("load", onLoad) }
})();