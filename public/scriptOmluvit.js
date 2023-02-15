
function omluvit(datum) {
    var duvod = $('#duvod-input').val().trim();
    var user = $('#user-id').val(); 
    console.log($('#user-id').val());
    if (duvod !== '') {
        $.ajax({
            url: '/teacher/absence/omluvit',
            type: 'POST',
            data: { datum: datum, duvod: duvod , user_id : user},
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
    } else {
        alert('Důvod nesmí být prázdný.'); // show an error message
    }
}
