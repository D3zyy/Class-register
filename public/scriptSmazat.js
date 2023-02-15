function smazat(datum) {
    var user_id = $('#user-id').val(); 
    $.ajax({
        
      url: '/teacher/absence/smazat',
      type: 'POST',
      data: { datum: datum, user_id : user_id },
      success: function () {
        location.reload();
      },
      error: function (xhr, status, error) {
        console.log(xhr.responseText);
      }
    });
  }
  