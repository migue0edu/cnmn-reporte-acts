$(document).ready( () => {
	$('[data-toggle="tooltip"]').tooltip();
	$("#solicitud").submit( ()  => {
		event.preventDefault();
		let form = $("#solicitud").serializeArray();
		$.ajax({
			url:"/solicitud",
			type: $("#solicitud").attr("method"),
			dataType: "json",
			data: form,
			success: (response) => {
				document.getElementById("solicitud").reset();
				alert("Solicitud agregada con éxito")
				window.location.assign("/views/solicitud")
			},
			error: (response) => {
				alert('Error')
			}
		})
	});
})