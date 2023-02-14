
function omluvit(datum) {
    var duvod = $('#duvod-input').val().trim(); // get and trim the value of the input field
    if (duvod !== '') {
        $.ajax({
            url: '/teacher/absence/omluvit',
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
        alert('Důvod nesmí být prázdný.'); // show an error message
    }
}
