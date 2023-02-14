function neomluvit(datum) {
    let encodedDatum = encodeURI(datum); // encode the datum parameter
    $.ajax({
        url: '/absence/' + encodedDatum + '/neomluvit',
        type: 'POST',
        complete: function () {
            location.reload();
        },
        error: function (xhr, status, error) {
            console.log(xhr.responseText);
        }
    });
}
