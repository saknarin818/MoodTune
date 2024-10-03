const clientId = 'c758204a602b4c90ad434be3b5143693';  // ใส่ client id ของคุณ
const clientSecret = 'e5f130d22ef2463ca795c53e8428cd1b';  // ใส่ client secret ของคุณ
const weatherApiKey = '188050462f17bee5beb06a8a680e94ba'; // ใส่ API Key ที่คุณได้รับจาก OpenWeatherMap

// API Controller
const APIController = (function () {
    const _getToken = async () => {
        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        });

        const data = await result.json();
        return data.access_token;
    };

    const _getGenres = async (token) => {
        const result = await fetch('https://api.spotify.com/v1/browse/categories?locale=en_US', {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        });

        const data = await result.json();
        return data.categories.items;
    };

    const _getPlaylistByGenre = async (token, genreId) => {
        const limit = 10;
        const result = await fetch(`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        });

        const data = await result.json();
        return data.playlists.items;
    };

    const _getTracks = async (token, tracksEndPoint) => {
        const result = await fetch(tracksEndPoint, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        });

        const data = await result.json();
        return data.items;
    };

    const _getTrack = async (token, trackEndPoint) => {
        const result = await fetch(trackEndPoint, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        });

        const data = await result.json();
        return data;
    };

    const _getWeather = async (city) => {
        const result = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`);
        
        if (!result.ok) {
            throw new Error('Weather data not found');
        }

        const data = await result.json();
        return data;
    };

    return {
        getToken() {
            return _getToken();
        },
        getGenres(token) {
            return _getGenres(token);
        },
        getPlaylistByGenre(token, genreId) {
            return _getPlaylistByGenre(token, genreId);
        },
        getTracks(token, tracksEndPoint) {
            return _getTracks(token, tracksEndPoint);
        },
        getTrack(token, trackEndPoint) {
            return _getTrack(token, trackEndPoint);
        },
        getWeather(city) {
            return _getWeather(city);
        }
    };
})();

// UI Controller
const UIController = (function () {
    const DOMElements = {
        selectGenre: '#select_genre',
        selectPlaylist: '#select_playlist',
        buttonSubmit: '#btn_submit',
        divSongDetail: '#song-detail',
        hfToken: '#hidden_token',
        divSonglist: '.song-list',
        cityInput: '#city_input',
        weatherButton: '#btn_get_weather',
        weatherDisplay: '#weather_display',
    };

    return {
        inputField() {
            return {
                genre: document.querySelector(DOMElements.selectGenre),
                playlist: document.querySelector(DOMElements.selectPlaylist),
                tracks: document.querySelector(DOMElements.divSonglist),
                submit: document.querySelector(DOMElements.buttonSubmit),
                songDetail: document.querySelector(DOMElements.divSongDetail),
                city: document.querySelector(DOMElements.cityInput),
                weatherButton: document.querySelector(DOMElements.weatherButton),
                weatherDisplay: document.querySelector(DOMElements.weatherDisplay),
            };
        },

        createGenre(text, value) {
            const html = `<option value="${value}">${text}</option>`;
            document.querySelector(DOMElements.selectGenre).insertAdjacentHTML('beforeend', html);
        },

        createPlaylist(text, value) {
            const html = `<option value="${value}">${text}</option>`;
            document.querySelector(DOMElements.selectPlaylist).insertAdjacentHTML('beforeend', html);
        },

        createTrack(id, name) {
            const html = `<a href="#" class="list-group-item list-group-item-action list-group-item-light" id="${id}">${name}</a>`;
            document.querySelector(DOMElements.divSonglist).insertAdjacentHTML('beforeend', html);
        },

        createTrackDetail(img, title, artist) {
            const detailDiv = document.querySelector(DOMElements.divSongDetail);
            detailDiv.innerHTML = '';
            const html = `
            <div class="row col-sm-12 px-0">
                <img src="${img}" alt="">        
            </div>
            <div class="row col-sm-12 px-0">
                <label class="form-label col-sm-12">${title}:</label>
            </div>
            <div class="row col-sm-12 px-0">
                <label class="form-label col-sm-12">By ${artist}:</label>
            </div>`;
            detailDiv.insertAdjacentHTML('beforeend', html);
        },

        resetTrackDetail() {
            this.inputField().songDetail.innerHTML = '';
        },

        resetTracks() {
            this.inputField().tracks.innerHTML = '';
            this.resetTrackDetail();
        },

        resetPlaylist() {
            this.inputField().playlist.innerHTML = '';
            this.resetTracks();
        },

        storeToken(value) {
            document.querySelector(DOMElements.hfToken).value = value;
        },

        getStoredToken() {
            return {
                token: document.querySelector(DOMElements.hfToken).value
            };
        },

        displayWeather(weatherData, recommendedGenre) {
            const html = `
                <h3>Weather in ${weatherData.name}</h3>
                <p>Temperature: ${weatherData.main.temp}°C</p>
                <p>Weather: ${weatherData.weather[0].description}</p>
                <p>Recommended Genre: ${recommendedGenre}</p>
            `;
            document.querySelector(DOMElements.weatherDisplay).innerHTML = html;
        },

        resetWeatherDisplay() {
            document.querySelector(DOMElements.weatherDisplay).innerHTML = '';
        }
    };
})();
// ฟังก์ชันเพื่อเล่นเพลงใน iframe
function playTrack(trackId) {
const embedUrl = `https://open.spotify.com/embed/track/${track.id}`;
    document.getElementById('spotify-player').src = embedUrl; // อัปเดต src ของ iframe
}


// App Controller
const APPController = (function (UICtrl, APICtrl) {
    const DOMInputs = UICtrl.inputField();

    const loadGenres = async () => {
        const token = await APICtrl.getToken();
        UICtrl.storeToken(token);
        const genres = await APICtrl.getGenres(token);
        genres.forEach(element => UICtrl.createGenre(element.name, element.id));
    };

    const getGenreByWeather = (weather) => {
        switch (weather) {
            case 'Clear':
                return 'Pop';
            case 'Clouds':
                return 'Soft Rock';
            case 'Rain':
                return 'Mood';
            case 'Snow':
                return 'Classical';
            case 'Extreme':
                return 'Dance';
            case 'Thunderstorm':
                return 'Rock';
            default:
                return 'Pop';
        }
    };

    DOMInputs.genre.addEventListener('change', async () => {
        UICtrl.resetPlaylist();
        const token = UICtrl.getStoredToken().token;
        const genreId = UICtrl.inputField().genre.value;
        const playlist = await APICtrl.getPlaylistByGenre(token, genreId);
        playlist.forEach(p => UICtrl.createPlaylist(p.name, p.tracks.href));
    });

    DOMInputs.submit.addEventListener('click', async (e) => {
        e.preventDefault();
        UICtrl.resetTracks();
        const token = UICtrl.getStoredToken().token;
        const playlistSelect = UICtrl.inputField().playlist;
        const tracksEndPoint = playlistSelect.value;
        const tracks = await APICtrl.getTracks(token, tracksEndPoint);
        tracks.forEach(el => UICtrl.createTrack(el.track.href, el.track.name));
    });

    

    DOMInputs.tracks.addEventListener('click', async (e) => {
        e.preventDefault();
        if (e.target.classList.contains('list-group-item')) {
            UICtrl.resetTrackDetail();
            const token = UICtrl.getStoredToken().token;
            const trackEndpoint = e.target.id; // ใช้ track id จาก element ที่คลิก
            const track = await APICtrl.getTrack(token, trackEndpoint);
    
            // แสดงรายละเอียดเพลง
            // UICtrl.createTrackDetail(track.album.images[0].url, track.name, track.artists[0].name);
            
            // ตรวจสอบและเล่นเพลงใน iframe โดยใช้ track.id
            if (track.id) {
                const embedUrl = `https://open.spotify.com/embed/track/${track.id}`;
                document.getElementById('spotify-player').src = embedUrl; // อัปเดต src ของ iframe
            } else {
                console.error('Track ID not found');
            }
        }
    });
    
    

    const loadWeather = async () => {
        const city = DOMInputs.city.value; // รับค่าจาก input
        try {
            const weatherData = await APICtrl.getWeather(city);
            const recommendedGenre = getGenreByWeather(weatherData.weather[0].main);
            UICtrl.displayWeather(weatherData, recommendedGenre);
        } catch (error) {
            console.error(error);
            UICtrl.resetWeatherDisplay();
            alert('Could not find weather data for that city.');
        }
    };

    DOMInputs.weatherButton.addEventListener('click', (e) => {
        e.preventDefault();
        loadWeather();
    });

    return {
        init() {
            loadGenres();
        }
    };
})(UIController, APIController);

APPController.init();
