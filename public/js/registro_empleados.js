$(document).ready( () => {
	$("#registro").submit( ()  => {
		event.preventDefault()
		var form = $("#registro").serializeArray();
		$.ajax({
			url:"",
			type: $("#registro").attr("method"),
			dataType: "json",
			data: form,
			success: (response) => {
				document.getElementById("registro").reset();
				alert("Usuario agregado con éxito")
			},
			error: (response) => {
				alert(response)
			}
		})
	});
})
