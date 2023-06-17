document.getElementById("signupLink").addEventListener("click", function(event) {
    event.preventDefault();
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("registrationForm").style.display = "block";
  });
  
  document.getElementById("loginLink").addEventListener("click", function(event) {
    event.preventDefault();
    document.getElementById("registrationForm").style.display = "none";
    document.getElementById("loginForm").style.display = "block";
  });
  document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission
  
    // Get the username and password entered by the user
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
  
    // Perform your login authentication here (e.g., sending a request to a server)
  
    // Assuming the login is successful, redirect the user to the home page
    window.location.href = "home.html";
  });
  