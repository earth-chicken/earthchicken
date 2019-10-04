
// Sign-in success callback
function onSuccess(googleUser) {
    console.log('Logged in as: ' + googleUser.getBasicProfile().getName());

    document.getElementById("gSignIn").style.display = "none";
    document.getElementById("gSignOut").style.display = "block";

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
//    document.getElementById("gSignIn").style.display = "block";
//    document.getElementById("gSignOut").style.display = "none";

    window.location.href = '/';

}