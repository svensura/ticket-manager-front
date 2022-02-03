$(document).ready(() => {


  getSellersName();
  gigsList();

  // take focus away
  document.addEventListener('click', (e) => { if(document.activeElement.toString() == '[object HTMLButtonElement]'){ document.activeElement.blur(); } });
});

// get sellers name
getSellersName = () => {

  const token = window.localStorage.getItem('token');

  $.ajax({
    "url": `${API_URL}/users/me`,
    "method": "GET",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    success: (user) => {
      $("#sellersName").text("Ticketverkauf " + user.name)
      // Store user id in hidden field
      $("#storeVendorid").val(user._id);
    },
    error: (request, message, error) => {
      handleException(request, message, error);
    }
  });
}

// Get all Gigs to display
gigsList = () => {

  const token = window.localStorage.getItem('token');

  $.ajax({
    "url": `${API_URL}/gigs`,
    "method": "GET",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    success: (gigs) => {
      gigs.sort(sort_by('houseNo'));
      gigListSuccess(gigs);
    },
    error: (request, message, error) => {
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
gigBuildTableRow = (gig) => {
  const ret = "<tr>" +
        "<td class='text-right'>" + gig.houseNo + "</td>" +
        "<td>" + gig.title + "</td>" +
        "<td>" + gig.performer.name + "</td>" +
        "<td>" + gig.venue.address + "</td>" +
        "<td class='text-right'>" + (gig.startSeats - gig.soldSeats) + "</td>" +
        "<td>" + 
        ((gig.cancelled) ? "<button type='button' disbabled " +
          "class='btn btn-default' disabled = 'disabled' style='background-color:red;' > <span class='glyphicon glyphicon-thumbs-down' />" : 
          "<button type='button' disbabled " +
          "class='btn btn-default' disabled = 'disabled' > <span class='glyphicon glyphicon-thumbs-up' />") +
         "</button>" +
         "</td >" + 
         "<td class='text-right'>" + gig.feeEur + "</td>" +
         "<td class='text-right'>" + gig.feeStudentEur + "</td>" +
        "<td>" + 
        ((gig.cancelled || (gig.startSeats - gig.soldSeats < 1)) ? "<button type='button' disabled" +
        "class='btn btn-default' disabled = 'disabled' " +

        "data-id='" + gig._id + "'>" +
        "<span class='glyphicon glyphicon-ban-circle' />" +
        "</button>" : "<button type='button' " +
        "onclick='gigGetBuy(this);' " +
        "class='btn btn-default' " +
        "data-id='" + gig._id + "'>" +
        "<span class='glyphicon glyphicon-shopping-cart' />" +
        "</button>") +
        "</td>" +
        "<td>" + 
        ((gig.cancelled || (gig.startSeats - gig.soldSeats < 1)) ? "<button type='button' disabled" +
        "class='btn btn-default' disabled = 'disabled' " +

        "data-id='" + gig._id + "'>" +
        "<span class='glyphicon glyphicon-ban-circle' />" +
        "</button>" : "<button type='button' " +
        "onclick='gigGetBuyStudent(this);' " +
        "class='btn btn-default' " +
        "data-id='" + gig._id + "'>" +
        "<span class='glyphicon glyphicon-education'  />" +
        "</button>") +
        "</td>" +
        "<td>" +
        "<button type='button' " +
          "onclick='gigGetRefund(this);' " +
          "class='btn btn-default' " +
          "data-id='" + gig._id + "'>" +
          "<span class='glyphicon glyphicon-transfer' />"
          + "</button>" +
        "</td >" +
        "<td>" +
        "<button type='button' " +
          "onclick='gigGetRefundStudent(this);' " +
          "class='btn btn-default' " +
          "data-id='" + gig._id + "'>" +
          "<span class='glyphicon glyphicon-education'  />"
          + "</button>" +
        "</td >" +
    "</tr>" 

  return ret;
}

gigGetBuy = (ctl) => {

  const token = window.localStorage.getItem('token');

  const id = $(ctl).data("id")

  // Store gig id in hidden field
  $("#storeid").val(id);

// Call Web API to get a Gig
  $.ajax({
    "url": `${API_URL}/gigs/${id}`,
    "method": "GET",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    success: (gig) => {
      gigToFieldsBuy(gig);
    },
    error: (request, message, error) => {
      handleException(request, message, error);
    }
  });
} 

gigGetBuyStudent = (ctl) => {
  console.log('GIG GET BUY STUDENTEN')
  const token = window.localStorage.getItem('token');

  const id = $(ctl).data("id")

  // Store gig id in hidden field
  $("#storeid").val(id);

// Call Web API to get a Gig
  $.ajax({
    "url": `${API_URL}/gigs/${id}`,
    "method": "GET",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    success: (gig) => {
      gigToFieldsBuyStudent(gig);
    },
    error: (request, message, error) => {
      handleException(request, message, error);
    }
  });
} 

function gigGetRefund(ctl) {

  const token = window.localStorage.getItem('token');

  const id = $(ctl).data("id")

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
      $(this).blur();
      if (confirm(`Wollen Sie ein Ticket für Haus Nr. ${gig.houseNo} zurückgeben?`)){
      gigBuy(-1);
      }   
      
    },
    error: (request, message, error) => {
      handleException(request, message, error);
    }
  });
} 

function gigGetRefundStudent(ctl) {

  const token = window.localStorage.getItem('token');

  const id = $(ctl).data("id")

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
      $(this).blur();
      if (confirm(`Wollen Sie ein Studenten-Ticket für Haus Nr. ${gig.houseNo} zurückgeben?`)){
      gigBuyStudent(-1);
      }   
      
    },
    error: (request, message, error) => {
      handleException(request, message, error);
    }
  });
} 

gigToFieldsBuy = (gig) => {
  $("#houseNo").text(gig.houseNo);
  $("#title").text('"' + gig.title + '"');
  $("#gName").text(gig.performer.name);
  $("#feeEur").text(gig.feeEur);
  $("#Ticket").html("Tickets für Haus Nr.")
  $('#gigUpdateButton').attr('onclick', 'buyClick()')
  gigOpenBuyForm()
}

gigToFieldsBuyStudent = (gig) => {
  console.log('GIG TO FIELDS BUY STUDENT')
  $("#houseNo").text(gig.houseNo);
  $("#title").text('"' + gig.title + '"');
  $("#gName").text(gig.performer.name);
  $("#feeEur").text(gig.feeStudentEur);
  $("#Ticket").html("Studenten-Tickets für Haus Nr.")
  $('#gigUpdateButton').attr('onclick', 'buyStudentClick()')
  gigOpenBuyStudentForm()
}


gigBuy = (amount) => {

const id = $("#storeid").val();
const data = new Object()
data.amount = amount 
const token = window.localStorage.getItem('token');
console.log(data)

  // Call Web API to sell a new gig
  $.ajax({
    "url": `${API_URL}/gigs_buy/${id}`,
    "method": "PATCH",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      },
    "processData": false,
    "data": `${JSON.stringify(data)}`
    ,
    success: () => {
      //alert(`You successfully ${amount<0?'refunded ' + (amount * -1):'bought ' + amount} ticket ${amount<0?'':'(s)'}`)
      alert(`Sie haben erfolgreich ${amount<0 ? ((amount * -1) + ' Ticket zurückgegenommen!') : (amount + ' Ticket' + `${amount<2 ? '' : '(s)' }` + ' verkauft!') }`)
      location.reload();
    },
    error: (request, message, error) => {
      if (request.status == 406) {
          alert(request.responseText);
      } else {
        handleException(request, message, error);
      }
      location.reload();
    }
  });
}


gigBuyStudent = (amount) => {

  const id = $("#storeid").val();
  const data = new Object()
  data.amount = amount 
  const token = window.localStorage.getItem('token');
  console.log(data)
  
    // Call Web API to sell a new gig
    $.ajax({
      "url": `${API_URL}/gigs_buyStudent/${id}`,
      "method": "PATCH",
      "headers": {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        },
      "processData": false,
      "data": `${JSON.stringify(data)}`
      ,
      success: () => {
        //alert(`You successfully ${amount<0?'refunded ' + (amount * -1):'bought ' + amount} ticket ${amount<0?'':'(s)'}`)
        alert(`Sie haben erfolgreich ${amount<0 ? ((amount * -1) + ' Stdenten-Ticket zurückgegenommen!') : (amount + ' Ticket' + `${amount<2 ? '' : '(s)' }` + ' verkauft!') }`)
        location.reload();
      },
      error: (request, message, error) => {
        if (request.status == 406) {
            alert(request.responseText);
        } else {
          handleException(request, message, error);
        }
        location.reload();
      }
    });
  }
  


// Handle click event on Buy button
function buyClick() {
  const amount = $("#amount").val();
  $(this).blur();
    if (confirm(`Möchten Sie ${amount} Ticket` + `${amount<0 ? '' : '(s)' }` +  ` verkaufen?`)){
      gigBuy(amount)
    }   
  
}

function buyStudentClick() {
  console.log('STUDENTEN CLICK')
  const amount = $("#amount").val();
  $(this).blur();
    if (confirm(`Möchten Sie ${amount} Studenten-Ticket` + `${amount<0 ? '' : '(s)' }` +  ` verkaufen?`)){
      gigBuyStudent(amount)
    }   
  
}

vendorListEmail = () => {

  const token = window.localStorage.getItem('token');

// Call Web API 
  $.ajax({
    "url": `${API_URL}/gigs_list_email_me`,
    "method": "POST",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    success: () => {
      console.log('POSTED EMAIL REQUEST')
   },
    error: (request, message, error) => {
      handleException(request, message, error);
    }
  });
} 

// Clear form fields
saleFormClear = () => {
  $("#amount").empty;
  gigCloseForm()
}

gigOpenBuyForm = () => {
  $("#table").hide()
  $("#navbar").hide()
  document.getElementById("saleForm").style.display = "block";
  $("#amount").focus()
}

gigOpenBuyStudentForm = () => {
  console.log('STUDENTEN OPEN FORM')
  $("#table").hide()
  $("#navbar").hide()
  document.getElementById("saleForm").style.display = "block";
  $("#amount").focus()
}

gigCloseForm = () => {
  $("#table").show()
  $("#navbar").show()
  $("#amount").val(1)
  document.getElementById("saleForm").style.display = "none";
}

