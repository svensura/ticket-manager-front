


$(document).ready(() => {
    const API_URL = 'http://localhost:3001'
    //const API_URL = 'https://sura-ticket-manager.herokuapp.com'
    formClear();
    
    $("#but_submit").click(() => {
        
        var username = $("#txt_uname").val().trim();
        var password = $("#txt_pwd").val().trim();

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
                        console.log(response.token)
                        window.localStorage.setItem('token', response.token)
                        window.location = "dashboard.html"
                    } else {
                        window.alert("Wrong email or password")
                    }    
                },
                error: (request, message, error) => {
                    handleException(request, message, error);
                  }
            });
        };
    });

});

const formClear = () => {
    $("#txt_uname").val("");
    $("#txt_pwd").val("");
    }

// Handle exceptions from AJAX calls
const handleException = (request, message, error) => {
    var msg = "";
  
    msg += "Code: " + request.status + "\n";
    msg += "Text: " + request.statusText + "\n";
    if (request.responseJSON != null) {
      msg += "Message" + request.responseJSON.Message + "\n";
    }
  
    alert(msg);
}