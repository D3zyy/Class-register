function neurceno(datum) {
    var duvod = $('#duvod-input').val().trim(); 
    
        $.ajax({
            url: '/teacher/absence/neurceno',
            type: 'POST',
            data: { datum: datum, duvod: duvod },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
    
}
