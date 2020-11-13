//creamos el objeto documento
const documento = {
	empleado: "",
	fecha:{
		fechaI: "",
		fechaF: ""
	},
	actividades:{
		
	}
}
//inicializamos contador de actividades
let contador = 1;
$(document).ready( () => {
	$("#fechaI,#fechaF").datetimepicker({
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
	$("#actFechaI,#actFechaF").datetimepicker({
		language:  'es',
		autoclose: 1
	});
	/*$("#autoEmp").autocomplete(
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
			$("#autoEmp").attr( "data-idEmp", ui.item.id )
			$("#idemp").val(``)
			$("#nombre").val(``)
			$("#area").val(``)
			$("#mail").val(``)
			$("#tel").val(``)
			return false
		}
	})
	.autocomplete( "instance" )._renderItem = ( ul, item ) => {
		return $( "<li>" )
		.append(  "<b>" + item.descripcion  )
		.appendTo( ul )
	}*/

	$("#clFind").click(() => {
		$("#autoEmp").val("")
		$("#autoEmp").attr("data-idEmp","")
		$("#idEmp,#nombre,#area,#mail,#tel").val("")

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
		if(beneficio && comunicacion && entrega && observacion){			
			documento.actividades[contador] = {
				titulo,
				objetivo,
				descripcion,
				entregable,
				fechaIni,
				fechaFin,
				beneficio,
				comunicacion,
				entrega,
				observacion
			} 
			document.getElementById("Regactividades").reset();
			$("#bodyActividades").append(
				'<tr class="text-center" id="'+contador+'">'+
					'<td>'+contador+'</td>'+
					'<td>'+titulo+'</td>'+
					'<td>'+descripcion+'</td>'+
					'<td>'+
						'<a class="text-danger" data-toggle="tooltip" data-placement="bottom" title="Eliminar" onclick="delActividad('+contador+')"><i class="far fa-trash-alt fa-2x"></i></a>'+
					'</td>'+
				'</tr>')
			$("#filaTabla").css("display","inline")
			let NumAct = $("#filaTabla").attr("data-contador")
			contador++;
			NumAct++;	
			$("#filaTabla").attr("data-contador",NumAct)
		}
	})
});
const finalizar = () => {
	let NumAct = $("#filaTabla").attr("data-contador")
	if(NumAct == "0")
		alert("Ingrese alguna actividad")
	else {
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
	}
}
const delActividad = (id) => {
	let NumAct = $("#filaTabla").attr("data-contador")
	delete documento["actividades"][id]
	$( "#"+id ).remove();
	NumAct--;
	$("#filaTabla").attr("data-contador",NumAct)
	if(NumAct=="0")
		$("#filaTabla").css("display","none")
}