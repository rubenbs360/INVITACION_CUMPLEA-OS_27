document.addEventListener('DOMContentLoaded', () => {
    // 1. CUENTA REGRESIVA
    // La fiesta es el Sábado 11 de Julio de 2026 a las 8:00 PM (20:00:00)
    const targetDate = new Date('2026-07-11T20:00:00-05:00').getTime();

    const countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference <= 0) {
            clearInterval(countdownInterval);
            document.getElementById('days').innerText = '00';
            document.getElementById('hours').innerText = '00';
            document.getElementById('minutes').innerText = '00';
            document.getElementById('seconds').innerText = '00';
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = days.toString().padStart(2, '0');
        document.getElementById('hours').innerText = hours.toString().padStart(2, '0');
        document.getElementById('minutes').innerText = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').innerText = seconds.toString().padStart(2, '0');
    }, 1000);

    // 2. MAPA INTERACTIVO (LEAFLETJS)
    const lat = -11.994043641469801;
    const lng = -77.00416030036027;

    const map = L.map('map', {
        center: [lat, lng],
        zoom: 16,
        zoomControl: false,
        dragging: !L.Browser.mobile,
        tap: !L.Browser.mobile
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // Icono personalizado dorado para el mapa
    const goldIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: #d4af37; width: 14px; height: 14px; border-radius: 50%; border: 3px solid #000; box-shadow: 0 0 10px #d4af37;"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });

    L.marker([lat, lng], { icon: goldIcon }).addTo(map)
        .bindPopup('<b style="color:#000;">¡Aquí es la Fiesta!</b><br><span style="color:#333;">Jirón las Gemas 483, SJL</span>')
        .openPopup();

    // 3. CONTROL DE MÚSICA
    const audio = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    let isPlaying = false;

    // Cambiar volumen inicial a algo suave
    audio.volume = 0.3;

    musicToggle.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            musicToggle.classList.remove('playing');
            musicToggle.innerHTML = '<i class="fa-solid fa-music"></i>';
        } else {
            audio.play().catch(error => {
                console.log("El navegador bloqueó la reproducción automática, interactúa primero.");
            });
            musicToggle.classList.add('playing');
            musicToggle.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
        }
        isPlaying = !isPlaying;
    });

    // 4. RSVP FORMULARIO (REDISRECCIÓN A WHATSAPP)
    const rsvpForm = document.getElementById('rsvpForm');
    const attendanceRadios = document.querySelectorAll('aria-container input[name="attendance"]');
    const guestsCountGroup = document.getElementById('guestsCountGroup');

    // Cambios dinámicos de los radio buttons
    document.querySelectorAll('input[name="attendance"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'si') {
                guestsCountGroup.style.display = 'flex';
            } else {
                guestsCountGroup.style.display = 'none';
            }
        });
    });

    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('guestName').value.trim();
        const attendance = document.querySelector('input[name="attendance"]:checked').value;
        const guestsCount = document.getElementById('guestsCount').value;

        // Celular de Oscar Ruben
        const hostNumber = '51900582683'; // Formato internacional, 51 para Perú


        let message = '';
        if (attendance === 'si') {
            const extra = guestsCount === '0' ? 'Iré solo.' : `Iré con ${guestsCount} acompañante(s).`;
            message = `¡Hola Oscar! 🌟 Confirmo mi asistencia a tu fiesta de 27 años. Soy *${name}*. ${extra} ¡Ahí nos vemos! 🎉`;
        } else {
            message = `Hola Oscar. 😢 Quería avisarte que no podré asistir a tu cumple de 27. Te deseo un excelente cumpleaños. ¡Un abrazo!`;
        }


        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${hostNumber}&text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank');
    });

    // 5. ANIMACIONES AL HACER SCROLL (APARICIÓN)
    const animElements = document.querySelectorAll('.scroll-anim');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target); // Solo anima una vez
            }
        });
    }, {
        threshold: 0.15
    });

    animElements.forEach(el => {
        observer.observe(el);
    });
});
