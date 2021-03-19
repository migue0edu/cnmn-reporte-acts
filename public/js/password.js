$(document).ready( () => {
    $('[data-toggle="tooltip"]').tooltip();
    $("#formPassword").submit( ()  => {
        event.preventDefault();
        let actual = $("#actual").val().trim(),
            nueva = $("#nueva").val().trim(),
            confirmacion = $("#confirmacion").val().trim();
        if(nueva === confirmacion){
            $.ajax({
                url: "/password",
                dataType: "json",
                type: "post",
                data: {actual, nueva, confirmacion},
                success: (response) => {
                    if(response.result==true){
                        alert("Contraseña actualizada con éxito.")
                        $("#log-in")[0].reset()
                        window.location ="/views/reporte"
                    } else
                        alert("La contraseña actual no coincide")
                },
                error:(response) => {
                    alert("Error, contacte al administrador.");
                }
            })
        } else
            alert("La contraseña nueva y la confirmación no coiciden.")
       
    })
});