// Render Google Sign-in button
function renderButton() {
    gapi.signin2.render('gSignIn', {
        'scope': 'profile email',
        'width': 240,
        'height': 50,
        'longtitle': true,
        'theme': 'dark',
        'onsuccess': onSuccess,
        'onfailure': onFailure
    });
}

// Sign-in success callback
function onSuccess(googleUser) {
    // Get the Google profile data (basic)
    //var profile = googleUser.getBasicProfile();

    // Retrieve the Google account data
    gapi.client.load('oauth2', 'v2', function () {
        var request = gapi.client.oauth2.userinfo.get({
            'userId': 'me'
        });
        request.execute(function (resp) {

            // Save user data
            saveUserData(resp);
            console.log('User Data Saved/updated successfully.');
            setTimeout(function(){}, 10);
            var gamerInfo = getGamerData(resp);
            console.log('Gamer Data fetched successfully.');

            console.log(gamerInfo);

            // Display the user details
            var profileHTML =
                '<h3>' +
                'Welcome to Earth Chicken, '+resp.given_name +
                '! <a href="javascript:void(0);" onclick="signOut();">Sign out</a>' +
                '</h3>';


            document.getElementsByClassName("userContent")[0].innerHTML = profileHTML;

            document.getElementById("gSignIn").style.display = "none";
            document.getElementsByClassName("userContent")[0].style.display = "block";
            console.log('Gamer Info displayed successfully.');

            var arr = document.getElementsByTagName('button');
            for(var i = 0;i<arr.length;i++){
                arr[i].onclick = function() { gamerAction(resp.id,this);changeButtonStyle(this) }
            }
        });
    });
}


// Sign-in failure callback
function onFailure(error) {
    alert(error);
}

// Sign out the user
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        document.getElementsByClassName("userContent")[0].innerHTML = '';
        document.getElementsByClassName("userContent")[0].style.display = "none";
        document.getElementById("gSignIn").style.display = "block";
    });

    auth2.disconnect();
}


// Save user data to the database
function saveUserData(userData){
//    $.post('userData.php', { oauth_provider:'google', userData: JSON.stringify(userData) });
}