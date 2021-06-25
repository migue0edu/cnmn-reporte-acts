$(document).ready( () => {
	$('[data-toggle="tooltip"]').tooltip();
	$("#fechaI").datetimepicker({
		language:  'es',
		format: "yyyy-mm-dd",
        weekStart: 1,
        todayBtn:  1,
		autoclose: 1,
		todayHighlight: 1,
		startView: 2,
		minView: 2,
		forceParse: 0
	});

	$("#solicitud").submit( ()  => {
		$("#btn-servicio").prop("disabled", true);
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
				$("#btn-servicio").prop("disabled", false);
				alert('Error')
			}
		})
	});
})