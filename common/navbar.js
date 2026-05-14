function openNav() {
    if ((screen.width >= 768) && (screen.width <= 1300)) {
        document.getElementById("myNav").style.width = "50%";
    } else {
        document.getElementById("myNav").style.width = "100%";
    }
}

function closeNav() {
    document.getElementById("myNav").style.width = "0%";
}

function initNavbar(config) {
    const { basePath, currentPage } = config;

    const pages = {
        about: { label: "About", path: `${basePath}about/index.html` },
        polynomialSolver: { label: "Polynomial Solver", path: `${basePath}polynomial-solver/index.html` },
        encryptDecrypt: { label: "Encrypt-Decrypt", path: `${basePath}encrypt-decrypt/index.html` },
        contact: { label: "Contact", path: "mailto:mohammedadnan2307@gmail.com" }
    };

    // Current page gets an empty href
    if (currentPage && pages[currentPage]) {
        pages[currentPage].path = "";
    }

    const navHTML = `
        <div id="myNav" class="overlay">
            <a href="javascript:void(0)" class="closebtn" id="nav-close-btn">&times;</a>
            <div class="overlay-content">
                <a href="${pages.about.path}">${pages.about.label}</a>
                <a href="${pages.polynomialSolver.path}">${pages.polynomialSolver.label}</a>
                <a href="${pages.encryptDecrypt.path}">${pages.encryptDecrypt.label}</a>
                <a href="${pages.contact.path}">${pages.contact.label}</a>
            </div>
        </div>
        <span class="menu-toggler" id="nav-open-btn"><i class="fas fa-bars"></i></span>

        <div id="navbar-left">
            <a href="${pages.about.path}">${pages.about.label}</a>
            <div class="dropdown">
                <a href="javascript:void(0)" class="dropbtn">Work</a>
                <div class="dropdown-content">
                    <a href="${pages.polynomialSolver.path}">${pages.polynomialSolver.label}</a>
                    <a href="${pages.encryptDecrypt.path}">${pages.encryptDecrypt.label}</a>
                </div>
            </div>
            <a href="${pages.contact.path}">${pages.contact.label}</a>
        </div>

        <a href="${basePath}index.html"><img class="logo" src="https://d26icxokvtdw5w.cloudfront.net/images/quill.png" alt="website-logo" /></a>

        <div id="navbar-right">
            <a href="https://x.com/MohammedAdnanY3" aria-label="X (Twitter)"><i class="fa-brands fa-x-twitter"></i></a>
            <a href="https://linkedin.com/in/adnan23" aria-label="LinkedIn"><i class="fab fa-linkedin"></i></a>
        </div>
    `;

    const navElement = document.querySelector("nav.fixed-top");
    if (navElement) {
        navElement.innerHTML = navHTML;

        // Attach event listeners
        document.getElementById("nav-open-btn").addEventListener("click", openNav);
        document.getElementById("nav-close-btn").addEventListener("click", closeNav);
    }
}

// Auto-initialize if config is set before script loads
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
        if (window.navbarConfig) {
            initNavbar(window.navbarConfig);
        }
    });
} else {
    // DOM already ready
    if (window.navbarConfig) {
        initNavbar(window.navbarConfig);
    }
}
