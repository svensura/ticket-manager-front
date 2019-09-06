$(document).ready(() => {
  //const API_URL = 'http://192.168.1.29:3001'
  const API_URL = 'https://sura-ticket-manager.herokuapp.com'
  venuesList();


  // take focus away
  document.addEventListener('click', (e) => { if(document.activeElement.toString() == '[object HTMLButtonElement]'){ document.activeElement.blur(); } });
});


// VENUE_FUNCTIONS
// Get all Venues to display
venuesList = () => {

  var token = window.localStorage.getItem('token');

  $.ajax({
    //"url": 'https://sura-ticket-manager.herokuapp.com/venues',
    "url": `${API_URL}/venues`,
    "method": "GET",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    success: (venues) => {
      venues.sort(sort_by('address', false, function(a){return a.toUpperCase()}));
      venueListSuccess(venues);
    },
    error: (request, message, error) => {
      handleException(request, message, error);
    }
  });
}

// Display all Venues returned from Web API call
venueListSuccess = (venues) => {
  // Iterate over the collection of data
  $.each(venues, (index, venue) => {
    // Add a row to the Venues table
    venueAddRow(venue);
  });
}

// Add Venue row to <table>
venueAddRow = (venue) => {
  // First check if a <tbody> tag exists, add one if not
  if ($("#venueTable tbody").length == 0) {
    $("#venueTable").append("<tbody></tbody>");
  }

  // Append row to <table>
  $("#venueTable tbody").append(
    venueBuildTableRow(venue));
}

// Build a <tr> for a row of table data
venueBuildTableRow = (venue) => {
  var ret = "<tr>" +
      "<td>" +
        "<button type='button' " +
          "onclick='venueGet(this);' " +
          "class='btn btn-default' " +
          "data-id='" + venue._id + "'>" +
          "<span class='glyphicon glyphicon-edit' />"
          + "</button>" +
        "</td >" +
        "<td>" + venue.address + "</td>" +
        "<td>" + venue.contact.name + "</td>" +
        "<td class='text-right'>" + venue.seats + "</td>" +
        "<td>" + 
        "<button type='button' disbabled " +
          "class='btn btn-default' disabled = 'disabled'>" +
          "<span class='" + 
        ((venue.active) ? 'glyphicon glyphicon-thumbs-up' : 'glyphicon glyphicon-thumbs-down') + "' />" +
         "</button>" +
         "</td >" + 
        "<td>" +
        "<button type='button' " +
        "onclick='venueDelete(this);' " +
        "class='btn btn-default' " +
        "data-id='" + venue._id + "'>" +
        "<span class='glyphicon glyphicon-remove' />" +
        "</button>" +
      "</td>" +
    "</tr>" 

  return ret;
}

venueGet = (ctl) => {

  var token = window.localStorage.getItem('token');

  // Get venue id from data- attribute
  var id = $(ctl).data("id");
  console.log(id);
  
  // Store venue id in hidden field
  $("#storeid").val(id);

  // Call Web API to get a Venuet
  $.ajax({
    //"url": `https://sura-ticket-manager.herokuapp.com/venues/${id}`,
    "url": `${API_URL}/venues/${id}`,
    "method": "GET",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    success: (venue) => {
      venueToFields(venue);

      // Change Update Button Text
      $("#venueUpdateButton").text("Update");
    },
    error: (request, message, error) => {
      handleException(request, message, error);
    }
  });
}

venueToFields = (venue) => {
  $("#address").val(venue.address);
  $("#cName").val(venue.contact.name);
  $("#cEmail").val(venue.contact.email);
  $("#cPhone").val(venue.contact.phone);
  $("#seats").val(venue.seats);
  $("#activeBox").prop('checked', (venue.active));
 venueOpenForm()
}

// Handle click event on Update button
venueUpdateClick = () => {
  // Build venue object from inputs
  venue = new Object();
  contact = new Object();
  venue._id = $("#storeid").val();
  venue.address = $("#address").val();
  venue.contact = contact;
  venue.contact.name = $("#cName").val();
  venue.contact.email= $("#cEmail").val();
  venue.contact.phone = $("#cPhone").val();
  venue.seats = $("#seats").val();
  venue.active = $('#activeBox').prop('checked');
  console.log('active:', venue.active)
  if ($("#venueUpdateButton").text().trim() == "Add") {
    venueAdd(venue);
  } else {
    venueUpdate(venue);
  }
}


venueUpdate = (venue) => {

  var token = window.localStorage.getItem('token');

  data = new Object();
  data.address = venue.address
  data.contact = venue.contact
  data.seats = venue.seats
  data.active = venue.active

  // Call Web API to update venue
  $.ajax({
    //"url": `https://sura-ticket-manager.herokuapp.com/venues/${venue._id}`,
    "url": `${API_URL}/venues/${venue._id}`,
    "method": "PATCH",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      },
    "processData": false,
    "data": `${JSON.stringify(data)}`
    ,
    success: (venue) => {
    venueUpdateSuccess(venue);
    },
    error: (request, message, error) => {
      handleException(request, message, error);
    }
  });
}

venueUpdateSuccess = (venue) => {
  venueUpdateInTable(venue);
}

venueAdd = (venue) => {

  var token = window.localStorage.getItem('token');

  data = new Object();
  data.address = venue.address
  data.contact = venue.contact
  data.seats = venue.seats
  data.active = venue.active


  // Call Web API to add a new venue
  $.ajax({
    //"url": `https://sura-ticket-manager.herokuapp.com/venues`,
    "url": `${API_URL}/venues`,
    "method": "POST",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      },
    "processData": false,
    "data": `${JSON.stringify(data)}`
    ,
    success: (venue) => {
      venueAddSuccess(venue);
    },
    error: (request, message, error) => {
      handleException(request, message, error);
    }
  });
}

venueAddSuccess = (venue) => {
  venueAddRow(venue);
  venueFormClear();
}

// Update venue in <table>
enueUpdateInTable = (venue) => {
  // Find Venue in <table>
  var row = $("#venueTable button[data-id='" + venue._id + "']")
            .parents("tr")[0];
  // Add changed venue to table
  $(row).after(venueBuildTableRow(venue));
  // Remove original product
  $(row).remove();

  // Clear form fields
  venueFormClear();

  // Change Update Button Text
  $("#venueUpdateButton").text("Add");
}


 // Delete venue from <table>
 function venueDelete(ctl) {
  $(this).blur();
  if (confirm("Are you sure ?")){
    var token = window.localStorage.getItem('token');

    var id = $(ctl).data("id");

    // Call Web API to delete a venue
    $.ajax({
      //"url": `https://sura-ticket-manager.herokuapp.com/venues/${id}`,
      "url": `${API_URL}/venues/${id}`,
      "method": "DELETE",
      "headers": {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        },
      "processData": false,
      "data": ''
      ,
      success: function (venue) {
        $(ctl).parents("tr").remove();
      },
      error: function (request, message, error) {
        handleException(request, message, error);
      }
    });
  }
 }

// Clear form fields
venueFormClear = () => {
  $("#address").val("");
  $("#cName").val("");
  $("#cEmail").val("");
  $("#cPhone").val("");
  $("#seats").val("");
  $("#activeBox").prop('checked', true);
  
  venueCloseForm()
}

venueOpenForm = () => {
  $("#table").hide()
  $("#navbar").hide()
  document.getElementById("venueForm").style.display = "block";
  $("#address").focus()
}
venueCloseForm = () => {
  $("#table").show()
  $("#navbar").show()
  document.getElementById("venueForm").style.display = "none";
}


