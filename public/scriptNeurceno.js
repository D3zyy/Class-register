function neurceno(datum,id) {
    var duvod = $('#' + id).val().trim();
    var user = $('#user-id').val(); 

        $.ajax({
            url: '/teacher/absence/neurceno',
            type: 'POST',
            data: { datum: datum, duvod: duvod , user_id : user},
            success: function () {
                location.reload();
            },
            error: function (xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
    
}
