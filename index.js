// define global variables
const clientId = keys.clientId;
const clientSecret = keys.clientSecret;
const cards = document.getElementById('cards');

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
    let artistName = input.artistName.value;
    console.log(testerFunction(artistName));
    input.reset();
})

// create new artist card
const makeArtistCard = (track) => {
    const card = document.createElement('div');
    card.classList.add('card');
    const body = document.createElement('div');
    body.classList.add('card-body');
    const p = document.createElement('p');
    p.classList.add('card-text');
    body.append(p);
    card.append(body);
    cards.append(card);
}

// run all functions through async await
const testerFunction = async (artistName) => {
    let accessToken = await getToken();
    let artist = await getArtist(artistName, accessToken);
    let artistId = await artist.artists.items[0].id;
    let topTracks = await getTopTracks(artistId, accessToken);
    topTracks.tracks.forEach(track => makeArtistCard(track));
    return topTracks.tracks;
}

// console.log(testerFunction());

/* Example of getting artistID without promise data
const artistID = artists.then(artists => artists.artists.items[0].id);
console.log(artistID);
 */