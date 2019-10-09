// Sign-in success callback
function onSuccess(googleUser) {
    console.log('Logged in as: ' + googleUser.getBasicProfile().getName());

    document.getElementById("gSignIn").style.display = "none";
//    document.getElementById("gSignOut").style.display = "block";
    id_token = googleUser.getAuthResponse().id_token;
    document.getElementById('myForm1').value = id_token;
    document.getElementById("myForm").submit();
//    window.location.href = '/service/'+id_token;
}

function signOut() {
    console.log('at function signout');
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });

    window.location.href = '/logout';
}

function onLoad() {
    gapi.load('auth2', function() {
        gapi.auth2.init();
    });
}