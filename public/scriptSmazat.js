function smazat(datum) {
    $.ajax({
        
      url: '/teacher/absence/smazat',
      type: 'POST',
      data: { datum: datum },
      success: function () {
        location.reload();
      },
      error: function (xhr, status, error) {
        console.log(xhr.responseText);
      }
    });
  }
  