$(document).ready(() => {
  //const API_URL = 'http://localhost:3001'
  const API_URL = 'https://sura-ticket-manager.herokuapp.com'
  usersList();

  // take focus away
  document.addEventListener('click', (e) => { if(document.activeElement.toString() == '[object HTMLButtonElement]'){ document.activeElement.blur(); } });
});

// USER_FUNCTIONS
// Get all Users to display
usersList = () => {

  var token = window.localStorage.getItem('token');

  $.ajax({
    "url": `${API_URL}/users`,
    "method": "GET",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    success: (users) => {
      users.sort(sort_by('name', false, function(a){return a.toUpperCase()}));
      userListSuccess(users);
    },
    error: (request, message, error) => {
      handleException(request, message, error);
    }
  });
}

// Display all Users returned from Web API call
userListSuccess = (users) => {
  // Iterate over the collection of data
  $.each(users, (index, user) => {
    // Add a row to the Users table
    userAddRow(user);
  });
}

// Add User row to <table>
userAddRow = (user) => {
  // First check if a <tbody> tag exists, add one if not
  if ($("#userTable tbody").length == 0) {
    $("#userTable").append("<tbody></tbody>");
  }

  // Append row to <table>
  $("#userTable tbody").append(
    userBuildTableRow(user));
}

// Build a <tr> for a row of table data
userBuildTableRow = (user) => {
  var ret = "<tr>" +
      "<td>" +
        "<button type='button' " +
          "onclick='userGet(this);' " +
          "class='btn btn-default' " +
          "data-id='" + user._id + "'>" +
          "<span class='glyphicon glyphicon-edit' />"
          + "</button>" +
        "</td >" +
        "<td>" + user.name + "</td>" +
        "<td>" + user.email + "</td>" +
        "<td>" + user.phone + "</td>" +
        "<td>" +
        "<button type='button' " +
        "onclick='userDelete(this);' " +
        "class='btn btn-default' " +
        "data-id='" + user._id + "'>" +
        "<span class='glyphicon glyphicon-remove' />" +
        "</button>" +
      "</td>" +
    "</tr>" 

  return ret;
}

userGet = (ctl) => {

  var token = window.localStorage.getItem('token');

  // Get user id from data- attribute
  var id = $(ctl).data("id");

  
  // Store user id in hidden field
  $("#storeid").val(id);

  // Call Web API to get a Product
  $.ajax({
    "url": `${API_URL}/users/${id}`,
    "method": "GET",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    success: (user) => {
      userToFields(user);

      // Change Update Button Text
      $("#userUpdateButton").text("Update");
    },
    error: (request, message, error) => {
      handleException(request, message, error);
    }
  });
}

userToFields = (user) => {
  $("#username").val(user.name);
  $("#email").val(user.email);
  $("#phone").val(user.phone);
  userOpenForm()
}

// Handle click event on Update button
userUpdateClick = () => {
  // Build user object from inputs
  user = new Object();
  user._id = $("#storeid").val();
  user.name = $("#username").val();
  user.email = $("#email").val();
  user.phone = $("#phone").val();
  user.password = $("#password").val();
  if ($("#userUpdateButton").text().trim() == "Add") {
    userAdd(user);
  } else {
    userUpdate(u^ser);
  }
}

function addClick() {
  formClear();
}

function userUpdate(user) {
  var token = window.localStorage.getItem('token');
  data = new Object();
  data.name = user.name
  data.email = user.email
  data.phone = user.phone
  if (user.password.length !== 0) {
    if (user.password.length > 6) {
      data.password = user.password
    } else {
      window.alert("Password must be at least 7 characters long")
    }
  }

  // Call Web API to update user
  $.ajax({
    "url": `${API_URL}/users/${id}`,
    "method": "PATCH",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      },
    "processData": false,
    "data": `${JSON.stringify(data)}`
    ,
    success: (user) => {
    userUpdateSuccess(user);
    },
    error: (request, message, error) => {
      handleException(request, message, error);
    }
  });
}

fuserUpdateSuccess = (user) => {
  userUpdateInTable(user);
}

userAdd = (user) => {

  var token = window.localStorage.getItem('token');

  data = new Object();
  data.name = user.name
  data.email = user.email
  data.phone = user.phone
  if (user.password.length > 6) {
      data.password = user.password
  } else {
    window.alert("Password is required and must be at least 7 characters long")
  }

  // Call Web API to add a new user
  $.ajax({
    "url": `${API_URL}/users`,
    "method": "POST",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      },
    "processData": false,
    "data": `${JSON.stringify(data)}`
    ,
    success: (reply) => {
      userAddSuccess(reply.user);
    },
    error: (request, message, error) => {
      handleException(request, message, error);
    }
  });
}

userAddSuccess = (user) => {
  userAddRow(user);
  userFormClear();
}

// Update user in <table>
userUpdateInTable= (user) => {
  // Find User in <table>
  var row = $("#userTable button[data-id='" + user._id + "']")
            .parents("tr")[0];
  // Add changed user to table
  $(row).after(userBuildTableRow(user));
  // Remove original product
  $(row).remove();

  // Clear form fields
  userFormClear();

  // Change Update Button Text
  $("#venueUpdateButton").text("Add");
}



 // Delete user from <table>
 function userDelete(ctl) {
  $(this).blur();
  if (confirm("Are you sure ?")){
    var token = window.localStorage.getItem('token');

    var id = $(ctl).data("id");

    // Call Web API to delete a user
    $.ajax({
      "url": `${API_URL}/users/${id}`,
      "method": "DELETE",
      "headers": {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        },
      "processData": false,
      "data": ''
      ,
      success: (user) => {
        $(ctl).parents("tr").remove();
      },
      error: (request, message, error) => {
        handleException(request, message, error);
      }
    });
  }
 }



// Clear form fields
userFormClear = () => {
  $("#username").val("");
  $("#email").val("");
  $("#phone").val("");
  $("#password").val("");
  userCloseForm()
}

userOpenForm = () => {
  $("#table").hide()
  $("#navbar").hide()
  document.getElementById("userForm").style.display = "block";
  $("#username").focus()
}

userCloseForm = () => {
  $("#table").show()
  $("#navbar").show()
  document.getElementById("userForm").style.display = "none";
}


