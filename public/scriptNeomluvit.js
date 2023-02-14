
function neomluvit(datum) {
    var duvod = $('#duvod-input').val().trim(); 
    if (duvod !== '') {
        $.ajax({
            url: '/teacher/absence/neomluvit',
            type: 'POST',
            data: { datum: datum, duvod: duvod },
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
