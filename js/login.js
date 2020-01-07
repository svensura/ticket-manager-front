$(document).ready(() => {
    //const API_URL = 'http://localhost:3001'
    const API_URL = 'https://sura-ticket-manager.herokuapp.com'
    formClear();
    
    $("#but_submit").click(() => {
        
        const username = $("#txt_uname").val().trim();
        const password = $("#txt_pwd").val().trim();
        if( username != "" && password != "" ){
            console.log('Clikck', username, password)
            $.ajax({
                "url": `${API_URL}/users/login`,
                "method": "POST",
                "headers": {
                    "Content-Type": "application/json",
                },
                "processData": false,
                "data": `{\n\t\"email\": \"${username}\",\n\t\"password\": \"${password}\"\n}`
                ,
                success: (response) => {
                    if (response.token) {
                        window.localStorage.setItem('token', response.token)
                        if (!response.user.vendor){
                            window.location = "dashboard.html"
                        } else {
                            window.location = "sale.html"
                        }   
                    } else {
                        window.alert("Falsche email-Adresse und/oder falsches Passwort!")
                    }    
                },
                error: (request, message, error) => {
                    handleException(request, message, error);
                  }
            });
        };
    });

});

formClear = () => {
    $("#txt_uname").val("");
    $("#txt_pwd").val("");
    }

// Handle exceptions from AJAX calls
handleException = (request, message, error) => {
    var msg = "";
  
    msg += "Code: " + request.status + "\n";
    msg += "Text: " + request.statusText + "\n";
    if (request.responseJSON != null) {
      msg += "Message" + request.responseJSON.Message + "\n";
    }
  
    alert(msg);
}