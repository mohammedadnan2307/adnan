document.addEventListener("DOMContentLoaded", () => {
    const avatarContainer = document.querySelector('.info-avatar');
    const avatarVideo = document.getElementById('avatar-video');

    if (avatarContainer && avatarVideo) {
        avatarContainer.addEventListener('mouseenter', () => {
            avatarVideo.style.display = 'block';
            avatarVideo.currentTime = 0;
            const playPromise = avatarVideo.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log("Video playback prevented by browser policy:", error);
                });
            }
        });

        avatarContainer.addEventListener('mouseleave', () => {
            avatarVideo.pause();
            avatarVideo.style.display = 'none';
        });
    }
});
