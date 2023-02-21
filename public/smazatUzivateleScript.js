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
  function smazatTridu(id) {


    $.ajax({
        
      url: '/smazatTridu',
      type: 'POST',
      data: { id_class : id },
      success: function () {
        location.reload();
      },
      error: function (xhr, status, error) {
        console.log(xhr.responseText);
      }
    });
  }
  function smazatPredmet(id) {
    console.log(id);

    $.ajax({
        
      url: '/smazatPredmet',
      type: 'POST',
      data: { id_subject : id },
      success: function () {
        location.reload();
      },
      error: function (xhr, status, error) {
        console.log(xhr.responseText);
      }
    });
  }
  
  