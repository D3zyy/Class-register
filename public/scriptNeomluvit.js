
function neomluvit(datum) {
    var duvod = $('#duvod-input').val().trim(); 
    var user_id = $('#user-id').val(); 
    if (duvod !== '') {
        $.ajax({
            url: '/teacher/absence/neomluvit',
            type: 'POST',
            data: { datum: datum, duvod: duvod , user_id : user_id},
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
    } else {
        alert('Důvod nesmí být prázdný.');
    }
}
