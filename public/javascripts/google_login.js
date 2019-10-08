// Sign-in success callback
function onSuccess(googleUser) {
    console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
/*
    gapi.client.load('oauth2', 'v2', function () {
        var request = gapi.client.oauth2.userinfo.get({
            'userId': 'me'
        });
//        request.execute(function (resp) {
//            saveUserData(resp);
//        };
*/
    document.getElementById("gSignIn").style.display = "none";
//    document.getElementById("gSignOut").style.display = "block";

    var id_token = googleUser.getAuthResponse().id_token;

    window.location.href = '/service/'+id_token;

}

function signOut() {
    console.log('at function signout');
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
//    document.getElementById("gSignIn").style.display = "block";
//    document.getElementById("gSignOut").style.display = "none";

    window.location.href = '/logout';

}

function onLoad() {
    gapi.load('auth2', function() {
        gapi.auth2.init();
    });
}