let isPlaying = false;
const radio = document.getElementById('radio');
const playButton = document.querySelector('.play-button');
const stationList = document.getElementById('stationList');
const stations = document.querySelectorAll('.station');
const nowPlaying = document.getElementById('nowPlaying');

function toggleRadio() {
    if (!radio.src) {
        radio.src = stations[0].dataset.url;
        radio.load();
    }
    if (isPlaying) {
        radio.pause();
        playButton.textContent = '▶️';
    } else {
        radio.play().then(() => {
            playButton.textContent = '⏸';
        }).catch(error => {
            console.error('Ошибка воспроизведения:', error);
            alert('Ошибка воспроизведения. Попробуйте другую станцию.');
        });
    }
    isPlaying = !isPlaying;
}

function toggleStationList() {
    stationList.classList.toggle('active');
}

stations.forEach(station => {
    station.addEventListener('click', function () {
        stations.forEach(s => s.classList.remove('active'));
        this.classList.add('active');
        radio.src = this.dataset.url;
        radio.load();
        nowPlaying.textContent = this.textContent;
        if (isPlaying) {
            radio.play().catch(error => console.error('Ошибка воспроизведения:', error));
        }
    });
});
