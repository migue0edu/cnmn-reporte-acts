$(document).ready( () => {
	$('[data-toggle="tooltip"]').tooltip();
	$("#registro").submit( ()  => {
		event.preventDefault();
		var form = $("#registro").serializeArray();
		$.ajax({
			url:"/empleados",
			type: $("#registro").attr("method"),
			dataType: "json",
			data: form,
			success: (response) => {
				document.getElementById("registro").reset();
				alert("Usuario agregado con éxito,Contraseña predeterminada:cnmn2021")
				window.location.assign("/views/reporte")
			},
			error: (response) => {
				alert(response)
			}
		})
	});
})
