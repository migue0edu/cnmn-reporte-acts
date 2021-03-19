$(document).ready( () => {
    $('[data-toggle="tooltip"]').tooltip();
    $("#log-in").submit( ()  => {
        event.preventDefault();
        let usuario = $("#usuario").val().trim(),
            password = $("#password").val().trim();
        $("#btn-inicia").prop("disabled",true)
        $.ajax({
            url: "/login",
            dataType: "json",
            type: "post",
            data: {usuario, password},
            success: (response) => {
                if(response.result==false){
                    $("#msg").css("display","inline-block")
                    $("#btn-inicia").prop("disabled",false)
                }else{
                    $("#btn-inicia").prop("disabled",false)
                    $("#log-in")[0].reset()
                    window.location ="/views/reporte"
                }
            },
            error:(response) => {
                $("#btn-inicia").prop("disabled","false")
                alert("Error, contacte al administrador.");
            }
        })
    })
});