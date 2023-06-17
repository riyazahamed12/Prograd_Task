const loginBtn = document.querySelector('.login-btn');
loginBtn.addEventListener('click', () => {
    console.log('Login clicked');
    window.location.href = 'f1.html';
  });
  function onGoogleSignIn(googleUser) {
    var idToken = googleUser.getAuthResponse().id_token;
  }

  


  function renderGoogleSignInButton() {
    gapi.signin2.render('googleSignInButton', {
      'scope': 'email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
      'onsuccess': onGoogleSignIn
    });
  }
  gapi.load('auth2', function() {
    gapi.auth2.init({
      client_id: 'YOUR_CLIENT_ID',
    }).then(function() {
      renderGoogleSignInButton();
    });
  });

