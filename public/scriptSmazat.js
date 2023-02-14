function smazat(datum) {
    
    $.ajax({
      url: '/absence/' + datum + '/smazat',
      type: 'POST',
      complete: function () {
         
        location.reload();
      },
      error: function (xhr, status, error) {
        console.log(xhr.responseText);
      }
    });
  
}