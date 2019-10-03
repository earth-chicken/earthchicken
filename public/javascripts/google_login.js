
// Sign-in success callback
function onSuccess(googleUser) {
    var name = googleUser.getBasicProfile().getName()
    console.log('Logged in as: ' + googleUser.getBasicProfile().getName());

    document.getElementById("gSignIn").style.display = "none";


    var id_token = googleUser.getAuthResponse().id_token;

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/server');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function() {
        console.log('Signed in as: ' + xhr.responseText);
    };
    xhr.send('idtoken=' + id_token);



//    self. = '/dashboard/' + name;

    // to do
    // send to db

}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
    document.getElementById("gSignIn").style.display = "block";

}


/*
// Render Google Sign-in button
function renderButton() {
    gapi.signin2.render('gSignIn', {
        'scope': 'profile email',
        'width': 240,
        'height': 50,
        'longtitle': true,
        'theme': 'dark',
        'onsuccess': onSuccess,
    });
}
*/
