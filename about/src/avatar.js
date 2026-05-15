document.addEventListener("DOMContentLoaded", () => {
    const avatarContainer = document.querySelector('.info-avatar');
    const avatarVideo = document.getElementById('avatar-video');

    if (!avatarContainer || !avatarVideo) return;

    let videoReady = false;

    // Preload the full video into buffer once the page is idle
    function preloadVideo() {
        avatarVideo.preload = 'auto';
        avatarVideo.load();
    }

    // Mark video as ready once fully buffered
    avatarVideo.addEventListener('canplaythrough', () => {
        videoReady = true;
    }, { once: true });

    // Start preloading after page load (use requestIdleCallback if available)
    if ('requestIdleCallback' in window) {
        requestIdleCallback(preloadVideo);
    } else {
        setTimeout(preloadVideo, 200);
    }

    avatarContainer.addEventListener('mouseenter', () => {
        avatarVideo.style.display = 'block';
        avatarVideo.currentTime = 0;

        if (videoReady) {
            // Video is buffered — play immediately
            avatarVideo.play().catch(() => {});
        } else {
            // Not yet buffered — play as soon as it's ready
            const onReady = () => {
                avatarVideo.play().catch(() => {});
                avatarVideo.removeEventListener('canplaythrough', onReady);
            };
            avatarVideo.addEventListener('canplaythrough', onReady);
            // Also try playing immediately in case enough is buffered
            avatarVideo.play().catch(() => {});
        }
    });

    avatarContainer.addEventListener('mouseleave', () => {
        avatarVideo.pause();
        avatarVideo.style.display = 'none';
    });
});
