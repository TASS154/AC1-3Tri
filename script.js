document.addEventListener('DOMContentLoaded', function () {
    const toggleSwitch = document.getElementById('theme-toggle');
    const themeImages = document.querySelectorAll('.theme-image');
    const navbar = document.getElementById('navbar');
    const logoImage = document.querySelector('.logo-image');
    const logo2Image = document.querySelector('.logo2-image'); // Seleciona a logo2
    const cardImage = document.querySelector('.card-image');
    const isDarkMode = localStorage.getItem('dark-mode') === 'true';

    function updateImagesToTheme(isDark) {
        themeImages.forEach(img => {
            if (img !== logoImage && img !== cardImage) {
                const darkSrc = img.getAttribute('data-dark');
                const lightSrc = img.getAttribute('data-light');
                img.src = isDark ? darkSrc : lightSrc;
            }
        });
        // Atualiza o src da logo2 também
        if (logo2Image) {
            const logo2DarkSrc = logo2Image.getAttribute('data-dark');
            const logo2LightSrc = logo2Image.getAttribute('data-light');
            logo2Image.src = isDark ? logo2DarkSrc : logo2LightSrc;
        }
    }

    function updateNavbarTheme(isDark) {
        if (isDark) {
            navbar.classList.add('dark-mode');
        } else {
            navbar.classList.remove('dark-mode');
        }
    }

    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        updateNavbarTheme(true);
        updateImagesToTheme(true);
        toggleSwitch.checked = true;
    } else {
        document.body.classList.remove('dark-mode');
        updateNavbarTheme(false);
        updateImagesToTheme(false);
    }

    toggleSwitch.addEventListener('change', function () {
        const isDark = toggleSwitch.checked;
        document.body.classList.toggle('dark-mode', isDark);
        updateNavbarTheme(isDark);
        updateImagesToTheme(isDark);
        localStorage.setItem('dark-mode', isDark);
    });
});
