$(document).ready( () => {
	$('[data-toggle="tooltip"]').tooltip();
	pintaHistorial();
});
const pintaHistorial = () => {
	$.ajax({
		url: "/solicitudes/historial/",
		dataType: "json",
		type: "get",
		success: (response) => {
			$.each(response, function( index, value ) {
			  	$("#body-historialSolicitud").append(
					'<tr class="text-center" style="vertical-align: middle;">'+
						'<td style="vertical-align: middle;">UDI-CNMN-'+value.folio+'</td>'+
						'<td style="vertical-align: middle;" class="font-weight-bold">'+value.nombre+'</td>'+
                        '<td style="vertical-align: middle;">'+value.area+'</td>'+
						'<td style="vertical-align: middle;">'+value.fecha.split("T")[0]+'</td>'+
						'<td style="vertical-align: middle;"><a class="text-danger" data-toggle="tooltip" data-placement="bottom" title="Observaciones" onclick="verSolicitud('+value.folio+',\''+value.marca+'\',\''+value.serie+'\',\''+value.modelo+'\',\''+value.institucional+'\',\''+value.ip+'\',\''+value.tipo+'\',\''+value.reparacion+'\',\''+value.instalacion+'\',\''+value.observaciones+'\',\''+value.laboratorio+'\')"><i style="color: #003653;" class="fas fa-desktop fa-2x"></i></a></td>'+
					'</tr>');
			});
		},
		error:(response) => {
			alert('Error');
		}
	})
}
const verSolicitud = (folio,marca,serie,modelo,serial,ip,tipo,reparacion,instalacion,observaciones,laboratorio) => {
	$('#modalSolicitud').modal('show')
	document.getElementById("marca").innerHTML = marca;
	document.getElementById("folio").innerHTML = 'Folio: UDI-CNMN-'+folio;
	document.getElementById("laboratorio").innerHTML =  laboratorio;
	document.getElementById("serie").innerHTML =  serie;
	document.getElementById("modelo").innerHTML = modelo;
	document.getElementById("serial").innerHTML = serial;
	document.getElementById("ip").innerHTML = ip;
	document.getElementById("tipo").innerHTML = tipo;
	document.getElementById("reparacion").innerHTML = reparacion; 
	document.getElementById("instalacion").innerHTML = instalacion;
	document.getElementById("observaciones").innerHTML =  observaciones;
}
const cerrar = (id) => {
	$('#modalSolicitud').modal('hide')
}