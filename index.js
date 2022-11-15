// define global variables
const clientId = keys.clientId;
const clientSecret = keys.clientSecret;
const cards = document.getElementById('cards');
let globalUserID = '';

// generate new access token using client ID and client secret
const getToken = async () => {
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
}

// toggle About button
const about = document.getElementById('about');
const footer = document.getElementById('footer');
about.addEventListener('click', () => {
    footer.classList.toggle('hidden');
})

// get userID
const loginForm = document.getElementById('loginForm');
const loginFormDiv = document.getElementById('loginFormDiv');
const logoutForm = document.getElementById('logoutForm');
const loggedIn = document.getElementById('loggedIn');
const userID = document.getElementById('userID');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    loginFormDiv.classList.toggle('hidden');
    logoutForm.classList.toggle('hidden');
    loggedIn.classList.toggle('hidden');
    globalUserID = loginForm.loginInput.value;
    userID.innerText = 'UserID: ' + globalUserID;
    loginForm.reset();
})
logoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    loginFormDiv.classList.toggle('hidden');
    logoutForm.classList.toggle('hidden');
    loggedIn.classList.toggle('hidden');
    globalUserID = '';
})

// create a new playlist logic button
const newPlaylist = document.getElementById('newPlaylist');
const createPlaylist = document.getElementById('createPlaylist');
createPlaylist.addEventListener('submit', (e) => {
    e.preventDefault();
    if (globalUserID == '') {
        newPlaylist.innerText = 'Must Log In First!!';
    }
})

// generate new playlist using userID
const generatePlaylist = async (userID) => {
    let accessToken = await getToken();
}


// get artist ID from search result
const getArtist = async (keyword, token) => {
    const result = await fetch ('https://api.spotify.com/v1/search?q=' + keyword + '&type=artist', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    const data = result.json();
    return data;
}

// get artist ID from search result
const getTracks = async (keyword, token) => {
    const result = await fetch ('https://api.spotify.com/v1/search?q=' + keyword + '&type=track', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    const data = result.json();
    return data;
}

// generate top ten tracks of artist
const getTopTracks = async (artistID, token) => {
    const result = await fetch (`https://api.spotify.com/v1/artists/${artistID}/top-tracks?country=US`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    const data = result.json();
    return data;
}

// get user input for artist name
const input = document.getElementById('input');
input.addEventListener('submit', (e) => {
    e.preventDefault();
    cards.replaceChildren();
    let sentence = input.artistName.value;
    let words = sentence.split(' ');
    words.forEach(async (word) => {
        let newTrack = await testWords(word);
        console.log(newTrack);
    });
    input.reset();
})

// create new artist card
const makeArtistCard = (track) => {
    const card = document.createElement('div');
    card.classList.add('card');
    // const image = document.createElement('img');
    // image.classList.add('card-image-top');
    // image.src = track.album.images[0].url;
    const body = document.createElement('div');
    body.classList.add('card-body');
    const p = document.createElement('p');
    p.classList.add('card-text');
    p.innerText = track.name;
    body.append(p);
    card.append(body);
    cards.append(card);
}

// run all functions through async await
const testWords = async (word) => {
    let accessToken = await getToken();
    let tracks = await getTracks(word, accessToken);
    makeArtistCard(tracks.tracks.items[0]);
    return tracks;
}

// run all functions through async await
const testerFunction = async (artistName) => {
    let accessToken = await getToken();
    let artist = await getArtist(artistName, accessToken);
    let artistId = await artist.artists.items[0].id;
    let topTracks = await getTopTracks(artistId, accessToken);
    return topTracks.tracks;
}

// console.log(testerFunction());

/* Example of getting artistID without promise data
const artistID = artists.then(artists => artists.artists.items[0].id);
console.log(artistID);
 */