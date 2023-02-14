function deleteEntry(id) {
    
      $.ajax({
        url: '/teacher/' + id + '/delete',
        type: 'POST',
        complete: function () {
           
          location.reload();
        },
        error: function (xhr, status, error) {
          console.log(xhr.responseText);
        }
      });
    
  }
  