/**
 * Chatbase widget - lazy loaded on first user interaction
 * instead of loading eagerly on every page load.
 */
(function () {
    let chatbaseLoaded = false;

    function loadChatbase() {
        if (chatbaseLoaded) return;
        chatbaseLoaded = true;

        if (!window.chatbase || window.chatbase("getState") !== "initialized") {
            window.chatbase = (...args) => {
                if (!window.chatbase.q) {
                    window.chatbase.q = [];
                }
                window.chatbase.q.push(args);
            };

            window.chatbase = new Proxy(window.chatbase, {
                get(target, prop) {
                    if (prop === "q") {
                        return target.q;
                    }
                    return (...args) => target(prop, ...args);
                },
            });
        }

        const script = document.createElement("script");
        script.src = "https://www.chatbase.co/embed.min.js";
        script.id = "FUajesT_KLwzqmCoMZkCX";
        script.domain = "www.chatbase.co";
        document.body.appendChild(script);
    }

    // Load chatbase on first user interaction (scroll, click, or touch)
    const interactionEvents = ["scroll", "click", "touchstart"];
    interactionEvents.forEach(function (event) {
        window.addEventListener(event, loadChatbase, { once: true, passive: true });
    });

    // Fallback: load after 5 seconds if no interaction
    setTimeout(loadChatbase, 5000);
})();
