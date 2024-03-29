$(document).ready(() => {

  usersList();

  // take focus away
  document.addEventListener('click', (e) => { if(document.activeElement.toString() == '[object HTMLButtonElement]'){ document.activeElement.blur(); } });
});

// USER_FUNCTIONS
// Get all Users to display
usersList = () => {

  const token = window.localStorage.getItem('token');

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
  const ret = "<tr>" +
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
        "<button type='button' disbabled " +
          "class='btn btn-default' disabled = 'disabled'>" +
          "<span class='" + 
        ((user.vendor) ? 'glyphicon glyphicon-eur' : 'glyphicon glyphicon-user' ) + "' />" +
         "</button>" +
         "<td>" +
        "<button type='button' " +
        "onclick='userDelete(this);' " +
        "class='btn btn-default' " +
        "data-id='" + user._id + "'>" +
        "<span class='glyphicon glyphicon-remove' />" +
        "</button>" + "</td>" +
    "</tr>" 

  return ret;
}

userGet = (ctl) => {

  const token = window.localStorage.getItem('token');

  // Get user id from data- attribute
  const id = $(ctl).data("id");
  console.log(id);


  
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
      $("#userUpdateButton").text('Übernehmen');
      $("#vendorField").hide();
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
  if (user.vendor) {
    $("#sendListButton").show();
  } else {
    $("#sendListButton").hide();
  }
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
  user.vendor = $('#vendorBox').prop('checked');
  if ($("#userUpdateButton").text().trim() == "Hinzufügen") {
    userAdd(user);
  } else {
    userUpdate(user);
  }
}

function addClick() {
  formClear();
}

function userUpdate(user) {
  const token = window.localStorage.getItem('token');
  data = new Object();
  data.name = user.name
  data.email = user.email
  data.phone = user.phone

  if (user.password.length !== 0) {
    if (user.password.length > 6) {
      data.password = user.password
    } else {
      window.alert("Das Passwort muss mindestens 7 Zeichen enthalten!")
    }
  }

  // Call Web API to update user
  $.ajax({
    "url": `${API_URL}/users/${user._id}`,
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

userUpdateSuccess = (user) => {
  userUpdateInTable(user);
}

userAdd = (user) => {

  const token = window.localStorage.getItem('token');

  data = new Object();
  data.name = user.name
  data.email = user.email
  data.phone = user.phone
  data.vendor = user.vendor
  if (user.password.length > 6) {
      data.password = user.password
  } else {
    window.alert("Das Passwort ist erforderlich und muss mindestens 7 Zeichen enthalten!")
  }
  console.log('DATA: ', data),
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
  $("#venueUpdateButton").text("Hinzufügen");
}



 // Delete user from <table>
 function userDelete(ctl) {
  $(this).blur();
  if (confirm("Sind Sie sicher?")){
    const token = window.localStorage.getItem('token');

    const id = $(ctl).data("id");

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
  $("#vendorField").show();
  $("#userUpdateButton").text("Hinzufügen");
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


