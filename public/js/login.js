$(document).ready( () => {
    $("#log-in").submit( ()  => {
        event.preventDefault();
        let usuario = $("#usuario").val().trim(),
        curp    = $("#curp").val().trim();
        $.ajax({
            url: "http://localhost:3000/login",
            dataType: "json",
            type: "post",
            data: {usuario, curp},
            success: (response) => {
                console.log(response);
                if(response.result==false){
                    $("#msg").css("display","inline-block")
                }else{
                    $("#log-in")[0].reset()
                    window.location ="/views/reporte"
                }
            },
            error:(response) => {
                alert(response);
            }
        })
    })
});