function smazat(datum) {
    
    var user = $('#user-id').val();  
    $.ajax({
        
      url: '/teacher/absence/smazat',
      type: 'POST',
      data: { datum: datum, user_id : user },
      success: function () {
        location.reload();
      },
      error: function (xhr, status, error) {
        console.log(xhr.responseText);
      }
    });
  }
  