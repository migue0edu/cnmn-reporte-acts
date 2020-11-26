$("#env_btn").on('click', () => {
    let usuario = $("#usuario").val().trim(),
    curp    = $("#curp").val().trim();
    debugger;
    if( !usuario || !curp )
        alert("Por favor, ingrese su número de empleado y su CURP.");
    else {
        $.ajax({
            url: "http://localhost:3000/login",
            dataType: "json",
            type: "post",
            data: {usuario, curp},
            success: (response) => {
                console.log(response);
                if(!response.result){
                    alert('Usuario y/o CURP son incorrectos.')
                }
            },
            error:(response) => {
                alert(response);
            }
        })
    }
});
