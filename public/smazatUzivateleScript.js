function smazatUzivatele(id) {
    

    $.ajax({
        
      url: '/smazatUzivatele',
      type: 'POST',
      data: { id_user : id },
      success: function () {
        location.reload();
      },
      error: function (xhr, status, error) {
        console.log(xhr.responseText);
      }
    });
  }
  