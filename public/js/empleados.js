const documento = {
	empleado: "",
	fecha:{
		fechaI: "",
		fechaF: ""
	},
	actividades:{
		
	}
}
$(document).ready( () => {
	$('#fechaI, #fechaF').datetimepicker({
		language:  'es',
		viewMode: 'months',
		format: 'yyyy-mm-dd',
		icons: {
			previous: 'fas fa-times-circle',
			next: 'fa fa-chevron-circle-right'
		}
	});
/*	$("#autoEmp").autocomplete(
	{
		minLength: 2,
		source: (req, res) =>
			{
				$.ajax({
					url: ,
					type: "post",
					dataType: "json",
					data: {
						term: req.term
					},
					success: (data) => { res(data) }
				})
			},
		select: ( event, ui ) => {
			$("#autoEmp").val(`(${ ui.item.codigo }) ${ ui.item.descripcion }`)
			$("#autoEmp").attr( "data-idP", ui.item.id )
			return false
		}
	})
	.autocomplete( "instance" )._renderItem = ( ul, item ) => {
		return $( "<li>" )
		.append(  "<b>" + item.descripcion  )
		.appendTo( ul )
	}
*/
	$("#clFind").click(() => {
		$("#autoEmp").val("")
		$("#autoEmp").attr("data-idP","")

	});
	$("#btnEmp").click( () => {
		let idemp = $("#autoEmp").attr("data-idEmp")
		if(idemp)
			documento.empleado = idemp;
		else 
			alert("Ingresa el empleado para continuar")
	})
	$("#btnFecha").click( () => {
		let inicio = $("#fechaI").val(),
			fin = $("#fechaF").val()
		if(inicio && fin){
			documento.fecha.fechaI = inicio
			documento.fecha.fechaF = fin
		} else
			alert("Ingrese fecha de inicio y fin")
	})
	$("#agregar").click( () => {
		let titulo = $("#titulo").val(),
			objetivo = $("#objetivo").val(),
			descripcion = $("#descripcion").val(),
			entregable = $("#entregable").val(),
			fechaIni = $("#actFechaI").val(),
			fechaFin = $("#actFechaF").val(),
			beneficio = $("#beneficio").val(),
			comunicacion = $("#comunicacion").val(),
			entrega = $("#entrega").val(),
			observacion = $("#observacion").val()
			act = documento.actividades
		if(titulo && objetivo && descripcion && fechaIni && fechaFin){			
			act.actividad = {
				titulo : titulo,
				objetivo : objetivo,
				descripcion : descripcion,
				entregable : entregable,
				fechaIni : fechaIni,
				fechaFin : fechaFin,
				beneficio : beneficio,
				comunicacion : comunicacion,
				entrega : entrega,
				observacion : observacion
			}			
		}
	})
/*	$("#registro").submit( ()  => {
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
const finalizar = () => {
	$.ajax({
		url: "urlarchivoback",
		dataType: "json",
		type: "post",
		data: documento,
		success: (response) => {
			alert("Guardado con éxito")
		},
		error:(response) => {
			alert(response)
		}
	})
}*/
