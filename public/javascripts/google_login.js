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

            profileHTML +=
                '<img src="'+resp.picture+'" width="50" height="50"/>' +
                '<p><b>Google ID: </b>'+resp.id+'</p>' +
                '<p><b>Name: </b>'+resp.name+'</p>';

            profileHTML +=
                '<p id = "currency"><b>Currency: </b>'+ gamerInfo['currency'] +'</p>' +
                '<p id = "carboin"><b>Carboin: </b>'+ gamerInfo['carboin'] +'</p>';

            profileHTML +=
                '<div class="btn-group" style="margin-top:1em;" align="center">' +
                '  <button id = "add_100d" type = "button" class = "btn1">add_100d</button>' +
                '  <button id = "add_100c" type = "button" class = "btn1">add_100c</button>' +
                '  <button id = "convert_100d_to_1c" type = "button" class = "btn1">100d_to_1c</button>' +
                '  <button id = "zero" type = "button" class = "btn1"> zero</button>' +
                '</div>' +
                '<div class="btn-group" style="" align="center">' +
                '  <button id = "5" type = "button" class = "btn1"> 5</button>' +
                '  <button id = "6" type = "button" class = "btn1"> 6</button>' +
                '  <button id = "7" type = "button" class = "btn1"> 7</button>' +
                '  <button id = "8" type = "button" class = "btn1"> 8</button>' +
                '</div>\n';

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



function onFailure(error) {
    alert(error);
}

function signOut() {
}

