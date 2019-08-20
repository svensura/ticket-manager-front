
const API_URL = 'http://192.168.1.29:3001'
//const API_URL = 'https://sura-ticket-manager.herokuapp.com'
// alphabetical sort function
var sort_by = function(field, reverse, primer){

    var key = primer ? 
        function(x) {return primer(x[field])} : 
        function(x) {return x[field]};
  
    reverse = !reverse ? 1 : -1;
  
    return function (a, b) {
        return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
      } 
  }
  
  function logoutClicked() {
    $(this).blur();
    if (confirm("Are you sure to logout ?")){
        var token = window.localStorage.getItem('token');
        // Call Web API to logout
        $.ajax({
            //"url": `https://sura-ticket-manager.herokuapp.com/users/logout`,
            "url": `${API_URL}/users/logout`,
            "method": "POST",
            "headers": {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            },
            "processData": false,
            "data": ''
            ,
            success: function (gig) {
                window.location = "index.html"
            },
            error: function (request, message, error) {
            handleException(request, message, error);
            }
        });
    }
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