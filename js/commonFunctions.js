
const API_URL = 'http://localhost:3001'
//const API_URL = 'https://sura-ticket-manager.herokuapp.com'
// alphabetical sort function
var sort_by = (field, reverse, primer) => {
  var key = primer ? 
    (x) =>  {return primer(x[field])} : 
    (x) => {return x[field]};
  reverse = !reverse ? 1 : -1;
  return (a, b) => {
    return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
  } 
}
  
  // logout
function logoutClicked() {
  $(this).blur();
  if (confirm("Are you sure to logout ?")){
    var token = window.localStorage.getItem('token');
    // Call Web API to logout
    $.ajax(
      {
        "url": `${API_URL}/users/logout`,
        "method": "POST",
        "headers": {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      "processData": false,
      "data": '',
        success: (gig) => {
          window.location = "index.html"
        },
        error: (request, message, error) => {
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

// sleep
sleep = (milliseconds) => {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}
