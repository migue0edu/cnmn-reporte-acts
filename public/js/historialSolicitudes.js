$(document).ready( () => {
	$('[data-toggle="tooltip"]').tooltip();
	pintaHistorial();
});
const pintaHistorial = () => {
	$.ajax({
		url: "/documento/historial/solicitudes",
		dataType: "json",
		type: "get",
		success: (response) => {
			$.each(response, function( index, value ) {
			  	$("#body-historial").append(
					'<tr class="text-center" style="vertical-align: middle;">'+
						'<td style="vertical-align: middle;">UDI-CNMN'+indice+'</td>'+
						'<td style="vertical-align: middle;">'+value.nombre+'</td>'+
                        '<td style="vertical-align: middle;">'+value.area+'</td>'+
						'<td style="vertical-align: middle;">'+value.fecha.split("T")[0]+'</td>'+
						'<td style="vertical-align: middle;"><a class="text-danger" data-toggle="tooltip" data-placement="bottom" title="Eliminar reporte" onclick="deleteReport('+value.id+')"></td>'+
					'</tr>');
			});
		},
		error:(response) => {
			alert('Error');
		}
	})
}