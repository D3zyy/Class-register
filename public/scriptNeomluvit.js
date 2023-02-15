
function neomluvit(datum,id) {
    var duvod = $('#' + id).val().trim();
    var user = $('#user-id').val();  

    if (duvod !== '') {
        $.ajax({
            url: '/teacher/absence/neomluvit',
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
        alert('Důvod nesmí být prázdný.');
    }
}
