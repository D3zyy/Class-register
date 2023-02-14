function neomluvit(datum) {
    $.ajax({
        
      url: '/teacher/absence/neomluvit',
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