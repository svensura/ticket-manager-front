$(document).ready(function () {
  const API_URL = 'http://192.168.1.29:3001'
  //const API_URL = 'https://sura-ticket-manager.herokuapp.com'
  gigsList();

  // take focus away
  document.addEventListener('click', function(e) { if(document.activeElement.toString() == '[object HTMLButtonElement]'){ document.activeElement.blur(); } });
});




// GIG_FUNCTIOONS
// Get all Gigs to display
gigsList = () => {

  var token = window.localStorage.getItem('token');

  $.ajax({
    //"url": 'https://sura-ticket-manager.herokuapp.com/gigs',
    "url": `${API_URL}/gigs`,
    "method": "GET",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    success: function (gigs) {
      gigs.sort(sort_by('houseNo'));
      gigListSuccess(gigs);
    },
    error: function (request, message, error) {
      handleException(request, message, error);
    }
  });
}

// Display all Gigs returned from Web API call
gigListSuccess = (gigs) => {
  // Iterate over the collection of data
  $.each(gigs, (index, gig) => {
    // Add a row to the Gigs table
    gigAddRow(gig);
  });
}

// Add Gig row to <table>
gigAddRow = (gig) => {
  // First check if a <tbody> tag exists, add one if not
  if ($("#gigTable tbody").length == 0) {
    $("#gigTable").append("<tbody></tbody>");
  }

  // Append row to <table>
  $("#gigTable tbody").append(
    gigBuildTableRow(gig));
}

// Build a <tr> for a row of table data
function gigBuildTableRow(gig) {
  var ret = "<tr>" +
      "<td>" +
        "<button type='button' " +
          "onclick='gigGet(this);' " +
          "class='btn btn-default' " +
          "data-id='" + gig._id + "/" + gig.venue.address + "'>" +
          "<span class='glyphicon glyphicon-edit' />"
          + "</button>" +
        "</td >" +
        "<td class='text-right'>" + gig.houseNo + "</td>" +
        "<td>" + gig.title + "</td>" +
        "<td>" + gig.performer.name + "</td>" +
        "<td>" + gig.venue.address + "</td>" +
        "<td class='text-right'>" + gig.feeEur + "</td>" +
        "<td class='text-right'>" + (gig.startSeats - gig.soldSeats) + "</td>" +
        "<td>" +
        "<button type='button' " +
        "onclick='gigSendList(this);' " +
        "class='btn btn-default' " +
        "data-id='" + gig._id + "'>" +
        "<span class='glyphicon glyphicon-envelope' />" +
        "</button>" + "</td>" +
        "<td>" +
        "<button type='button' " +
        "onclick='gigDelete(this);' " +
        "class='btn btn-default' " +
        "data-id='" + gig._id + "'>" +
        "<span class='glyphicon glyphicon-remove' />" +
        "</button>" +
      "</td>" +
    "</tr>" 

  return ret;
}

function gigGet(ctl) {
  
  var token = window.localStorage.getItem('token');

  // Get gig id from  first part of data- attribute (Split-operator = /)
  var id = $(ctl).data("id").split("/")[0];

  // Get address from  second part of data- attribute (Split-operator = /)
  var workingAddress = $(ctl).data("id").split("/")[1];

  // Store gig id in hidden field
  $("#storeid").val(id);

  // Call Web API to get a Gig
  $.ajax({
    //"url": `https://sura-ticket-manager.herokuapp.com/gigs/${id}`,
    "url": `${API_URL}/gigs/${id}`,
    "method": "GET",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    success: function (gig) {
      gigToFields(gig);
      addressesToForm(workingAddress);
      // Change Update Button Text
      $("#gigUpdateButton").text("Update");
    },
    error: function (request, message, error) {
      handleException(request, message, error);
    }
  });

  function gigToFields(gig) {
    $("#houseNo").val(gig.houseNo);
    $("#title").val(gig.title);
    $("#gName").val(gig.performer.name);
    $("#gEmail").val(gig.performer.email);
    $("#gPhone").val(gig.performer.phone);
    $("#feeEur").val(gig.feeEur);
    $("#sSeats").val(gig.startSeats);
    gigOpenForm()
  }


}


// Call Web API to get a List of active Venues
function addressesToForm(workingAddress) {

  var token = window.localStorage.getItem('token');

  $.ajax({
    //"url": `https://sura-ticket-manager.herokuapp.com/venues`,
    "url": `${API_URL}/venues`,
    "method": "GET",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    success: function (venuesActive) {
      venuesActive.sort(sort_by('address', false, function(a){return a.toUpperCase()}));
      var addresses = []
      var venueIds = []
      venuesActive.forEach(function (venue) {
        if(venue.active){        
          addresses.push(venue.address)
          venueIds.push(venue._id)
        }
      })
      arrayToSelect(addresses, venueIds, 'gAddress', workingAddress);
    },
    error: function (request, message, error) {
      handleException(request, message, error);
    }
  });
} 

function arrayToSelect(array, values, selectId, match) {
  var hasFound = false
  $("#" + selectId).empty()
  $.each(array, function(index, text) {
    if (text == match){
      $("#" + selectId).append( $('<option selected="selected"></option>').val(values[index]).html(text) )
      hasFound = 'true'
    } else {
      $("#" + selectId).append( $('<option></option>').val(values[index]).html(text) )
    }
  });
  if (hasFound == false && match) {
    $("#" + selectId).append( $('<option selected="selected"></option>').html(match + ' -- NOT ACTIVE!') )
  }
}

// Handle click event on Update button
function gigUpdateClick() {
      
       // Build gig object from inputs
      gig = new Object();
      performer = new Object();
      // venue = new Object();
      gig._id = $("#storeid").val().split("/")[0];
      gig.houseNo = $("#houseNo").val();
      gig.title = $("#title").val();
      gig.performer = performer;
      gig.performer.name = $("#gName").val();
      gig.performer.email= $("#gEmail").val();
      gig.performer.phone = $("#gPhone").val();
      gig.venue = $("#gAddress").val();
      gig.feeEur = parseFloat(($("#feeEur").val())).toFixed(2)
      //console.log(gig.feeEur)
      if ($("#gigUpdateButton").text().trim() == "Add") {
        gigAdd(gig);
      }
      else {
        gigUpdate(gig);
      }
    }


function gigUpdate(gig) {

  var token = window.localStorage.getItem('token');

  data = new Object();
  data.houseNo = gig.houseNo
  data.title = gig.title
  data.performer = gig.performer
  data.venue = gig.venue
  data.feeEur = gig.feeEur

  // Call Web API to update gig
  $.ajax({
    //"url": `https://sura-ticket-manager.herokuapp.com/gigs/${gig._id}`,
    "url": `${API_URL}/gigs/${gig._id}`,
    "method": "PATCH",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      },
    "processData": false,
    "data": `${JSON.stringify(data)}`
    ,
    success: function (gig) {
    gigUpdateSuccess(gig);
    },
    // error: function (request, message, error) {
    //   if (request.status == 406) {
    //       alert(request.responseText);
    //   } else {
    //     handleException(request, message, error);
    //   }
    // }
    error: function (request, message, error) {
      handleException(request, message, error);
    }
  });
}

function gigUpdateSuccess(gig) {

  venue = new Object
  venue.address = $("#gAddress option:selected").text() 
  delete gig.venue
  gig.venue = venue
  gigUpdateInTable(gig);
}

function gigAdd(gig) {

 var token = window.localStorage.getItem('token');

  data = new Object();
  data.houseNo = gig.houseNo
  data.title = gig.title
  data.performer = gig.performer
  data.venue = gig.venue
  data.feeEur = gig.feeEur

  // Call Web API to add a new gig
  $.ajax({
    //"url": `https://sura-ticket-manager.herokuapp.com/gigs`,
    "url": `${API_URL}/gigs`,
    "method": "POST",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      },
    "processData": false,
    "data": `${JSON.stringify(data)}`
    ,
    success: function () {
      location.reload();
    },
    error: function (request, message, error) {
      handleException(request, message, error);
    }
  });
}

function gigAddSuccess(gig) {
  gigAddRow(gig);
  gigFormClear();
}

// Update gig in <table>
function gigUpdateInTable(gig) {
  // Find Gig in <table>
  var row = $("#gigTable button[data-id='" + gig._id + "']")
            .parents("tr")[0];
  // Add changed gig to table
  $(row).after(gigBuildTableRow(gig));
  // Remove original gig
  $(row).remove();

  // Clear form fields
  gigFormClear();

  // Change Update Button Text
  $("#gigUpdateButton").text("Add");
}

// Handle click event on Add button
function addClick() {
  console.log('addClick');
  
}

// Send Paypal-List with sold Tickets
function gigSendList(ctl) {
  $(this).blur();
  if (confirm("Are you sure ?")){
    var token = window.localStorage.getItem('token');

    var id = $(ctl).data("id");

    // Call Web API to delete a gig
    $.ajax({
      //"url": `https://sura-ticket-manager.herokuapp.com/gigs/${id}`,
      "url": `${API_URL}/gigs_list/${id}`,
      "method": "POST",
      "headers": {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        },
      "processData": false,
      "data": ''
      ,
      success: function (response) {
        window.alert(response)
      },
      error: function (request, message, error) {
        handleException(request, message, error);
      }
    });
  }
 }

 // Delete gig from <table>
 function gigDelete(ctl) {
  $(this).blur();
  if (confirm("Are you sure ?")){
    var token = window.localStorage.getItem('token');

    var id = $(ctl).data("id");

    // Call Web API to delete a gig
    $.ajax({
      //"url": `https://sura-ticket-manager.herokuapp.com/gigs/${id}`,
      "url": `${API_URL}/gigs/${id}`,
      "method": "DELETE",
      "headers": {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        },
      "processData": false,
      "data": ''
      ,
      success: function (gig) {
        $(ctl).parents("tr").remove();
      },
      error: function (request, message, error) {
        handleException(request, message, error);
      }
    });
  }
 }

// Clear form fields
function gigFormClear() {
  $("#houseNo").val("");
  $("#title").val("");
  $("#gName").val("");
  $("#gEmail").val("");
  $("#gPhone").val("");
  $("#gAddress").empty();
  $("#sSeats").val("");
  $("#feeEur").val("");
  gigCloseForm()
}

function gigOpenForm() {
  $("#table").hide()
  $("#navbar").hide()
  document.getElementById("gigForm").style.display = "block";
  addressesToForm();
  $("#houseNo").focus()
}

function gigCloseForm() {
  $("#table").show()
  $("#navbar").show()
  $("#gigUpdateButton").text("Add");
  document.getElementById("gigForm").style.display = "none";
}

