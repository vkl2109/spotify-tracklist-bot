const clientId = keys.clientId;
const clientSecret = keys.clientSecret;

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

const newKeyWord = 'Yesterday';

const testerFunction = async () => {
    let accessToken = await getToken()
    let testerTracks = await getTracks(newKeyWord, accessToken)
    return testerTracks;
}

const tracks = testerFunction();

console.log(tracks);

tracks.then(tracks => tracks.items.forEach(track => {
    console.log(track.name)
}))