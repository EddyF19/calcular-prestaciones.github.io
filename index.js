import * as dateFns from "https://cdn.skypack.dev/date-fns@2.22.1";

let btnCalcular = document.getElementById('btnCalcular');
let btnLimpiar = document.getElementById('btnLimpiar')

let inputSalary = document.querySelectorAll('.input-salary');
let inputComisiones = document.querySelectorAll('.input-comisiones');
let inputTotal = document.querySelectorAll('.input-total');
let inputFechaIngreso = document.getElementById('dateFechaIngreso');
let inputFechaSalida = document.getElementById('dateFechaSalida');

let radioOrdinario = document.getElementById('calculo-ordinario');
let radioIntermitente = document.getElementById('calculo-intermitente');

let dividirPromedio = 1;
let yearsTrabajados = 0;
let mesesTrabajados = 0;
let diasTrabajados = 0;

// *Variables utilizada para calcular salario de vacaciones
let yearIngreso;
let yearSalida;

(function() {inputSalary.forEach(input => input.setAttribute("disabled", true))}) ();
(function() {inputComisiones.forEach(input => input.setAttribute("disabled", true))}) ();
(function() {inputTotal.forEach(input => input.setAttribute("disabled", true))}) ();

// *Activa los inputs en el rango especificado
function activarInputs(longitud){
    /* 
        * En caso de que el usuario cambie la fecha a una que tenga un intervalo menor, que la primera seleccionada
        * Desactivo todos los inputs y vuelvo a activar solamente lo que estan en rango
    */
    (function() {inputSalary.forEach(input => input.setAttribute("disabled", true))}) ();
    (function() {inputComisiones.forEach(input => input.setAttribute("disabled", true))}) ();

    if(longitud <= 1)
    {        
        inputSalary[0].removeAttribute('disabled');                    
        inputComisiones[0].removeAttribute('disabled');
        dividirPromedio = 1; 
    }
    else{        
        for(let i = 0; i < longitud ; i++){            
            inputSalary[i].removeAttribute('disabled'); 
            inputComisiones[i].removeAttribute('disabled');
            dividirPromedio = longitud                  
        }   
    }
}

inputFechaSalida.addEventListener('change', function(){
    let fechaIngreso = inputFechaIngreso.value;
    let fechaSalida = inputFechaSalida.value;
    if(validarFechas(fechaIngreso, fechaSalida)){
        let mesesActivar = calcularTiempoTrabajado(fechaIngreso, fechaSalida);        
        mesesTrabajados = mesesActivar.months; 
        diasTrabajados = mesesActivar.days;
        yearsTrabajados = mesesActivar.years;    
        // *Activa todos los inputs si el intervalo entre las fechas es de 1 anio
        if(mesesActivar.years >= 1)
        {            
            (function() {inputSalary.forEach(input => input.removeAttribute("disabled"))}) ();
            (function() {inputComisiones.forEach(input => input.removeAttribute("disabled"))}) (); 
            dividirPromedio = 12;  
            // yearsTrabajados = mesesActivar.years;    
            // mesesTrabajados = mesesActivar.months; 
            // diasTrabajados = mesesActivar.days;
            
            
        }
        else{          
            
            activarInputs(mesesActivar.months)  
        }
    }        
})

inputFechaIngreso.addEventListener('change', function(){
    let fechaIngreso = inputFechaIngreso.value;
    let fechaSalida = inputFechaSalida.value;
    if(validarFechas(fechaIngreso, fechaSalida)){
        let mesesActivar = calcularTiempoTrabajado(fechaIngreso, fechaSalida);        
        // *Activa todos los inputs si el intervalo entre las fechas es de 1 anio
        mesesTrabajados = mesesActivar.months; 
        diasTrabajados = mesesActivar.days;
        yearsTrabajados = mesesActivar.years; 
        if(mesesActivar.years >= 1)
        {        
            dividirPromedio = 12;      
            (function() {inputSalary.forEach(input => input.removeAttribute("disabled"))}) ();
            (function() {inputComisiones.forEach(input => input.removeAttribute("disabled"))}) ();
                   
        }
        else{                      
            activarInputs(mesesActivar.months)  
        }
    }    
})

// *Funcion que valida fecha
function validarFechas(fechaIngreso, fechaSalida)
{
    return (fechaIngreso && fechaSalida) && (fechaSalida > fechaIngreso)           
}

// *Funcion que calcula el tiempo trabajado
function calcularTiempoTrabajado(fechaIngreso, fechaSalida){    
    fechaIngreso = fechaIngreso.split('-');
    fechaSalida = fechaSalida.split('-');
    yearIngreso = fechaIngreso[0];
    yearSalida = fechaSalida[0];
    // *Sumarle 1 dia y que quede en coordinacion
    fechaSalida = dateFns.add(new Date (fechaSalida), {
        years: 0,
        months: 0,
        weeks: 0,
        days: 1,
        hours: 0,
        minutes: 0,
        seconds: 0
    })    
    
    let fecha = dateFns.intervalToDuration({    
        start: new Date(fechaIngreso),
        end: new Date(fechaSalida)
    })            
    return fecha
}

function formatearTiempoTrabajado(fecha){
    let tiempoTrabajado = '';
    let i = 0;  
    let key;
      for (key in fecha){
        if ( i < 3 ){
            if(fecha[key] != 0){
                tiempoTrabajado += `${fecha[key]} ${key} `                
            }
        }
        else{
            break
        }
        ++i;
    }   
    return tiempoTrabajado;
}


/* 
    *Calcular Sumatoria de los Salarios    
        *Funcion creada aparte porque no importa que opciones se elijan 
        *en la frecuencia de pago, el valor de la sumatoria de los sueldos no varia
        *Ademas los demas sueldos derivan de esta
*/
function calcularSalarios(inputsTotal){
    let sumSalarios = 0;      
    inputsTotal.forEach(element => {
        sumSalarios += Number(element.value.replaceAll(',',''));
    })
    return sumSalarios
}

function calcularSalariosBasadoOpciones(sumSalarios){    
    let salarioPromedioMensual;
    let salarioPromedioDiario;
    if(document.getElementById('calculo-ordinario').checked){        
        if(document.getElementById("periodo-mensual").checked){
            salarioPromedioMensual = (sumSalarios / dividirPromedio);
            salarioPromedioDiario = (sumSalarios / dividirPromedio) / 23.83;            
        }        
        else if(document.getElementById("periodo-quincenal").checked){
            salarioPromedioMensual = ((sumSalarios / dividirPromedio) * 2)            
            salarioPromedioDiario = salarioPromedioMensual / 23.82;
        }
        else if(document.getElementById('periodo-semanal').checked){
            if(yearsTrabajados > 0){
                salarioPromedioMensual = sumSalarios / 2.769252071;
                salarioPromedioDiario = salarioPromedioMensual / 23.83317;
            }
            else{
                let mesesTrabajadosAux = (mesesTrabajados < 1) ? 1 : mesesTrabajados; 
                salarioPromedioDiario = (sumSalarios / mesesTrabajadosAux) / 5.5;
                salarioPromedioMensual = salarioPromedioDiario * 23.83;
            }
        }
        else{
            salarioPromedioMensual = (sumSalarios / dividirPromedio) * 23.83;
            salarioPromedioDiario = sumSalarios / dividirPromedio;            
        }
        document.getElementById("sum-salarios").innerText = new Intl.NumberFormat('en-US', {maximumFractionDigits: 2}).format(sumSalarios);        
        document.getElementById('salario-promedio-mensual').innerText = new Intl.NumberFormat('en-US', {maximumFractionDigits: 2}).format(salarioPromedioMensual);
        document.getElementById('salario-promedio-diario').innerText = new Intl.NumberFormat('en-US', {maximumFractionDigits: 2}).format(salarioPromedioDiario);
        // document.getElementById("sum-salarios").innerText = new Intl.NumberFormat('en-US', {maximumFractionDigits: 2, style: 'currency', currency: 'DOP', currencyDisplay: 'narrowSymbol'}).format(sumSalarios);        
        // document.getElementById('salario-promedio-mensual').innerText = new Intl.NumberFormat('en-US', {maximumFractionDigits: 2, style: 'currency', currency: 'DOP', currencyDisplay: 'narrowSymbol'}).format(salarioPromedioMensual);
        // document.getElementById('salario-promedio-diario').innerText = new Intl.NumberFormat('en-US', {maximumFractionDigits: 2, style: 'currency', currency: 'DOP', currencyDisplay: 'narrowSymbol'}).format(salarioPromedioDiario);
    }
    else{
     
        if(document.getElementById("periodo-mensual").checked){
            salarioPromedioMensual = (sumSalarios / dividirPromedio);
            salarioPromedioDiario = (sumSalarios / dividirPromedio) / 26;            
        }        
        else if(document.getElementById("periodo-quincenal").checked){
            salarioPromedioMensual = ((sumSalarios / dividirPromedio) * 2)            
            salarioPromedioDiario = salarioPromedioMensual / 26;
        }
        else if(document.getElementById('periodo-semanal').checked){
            if(yearsTrabajados > 0){
                salarioPromedioMensual = sumSalarios / 2.769252071;
                salarioPromedioDiario = salarioPromedioMensual / 26;
            }
            else{
                let mesesTrabajadosAux = (mesesTrabajados < 1) ? 1 : mesesTrabajados; 
                salarioPromedioDiario = (sumSalarios / mesesTrabajadosAux) / 6;
                salarioPromedioMensual = salarioPromedioDiario * 26;
            }
        }
        else{            
            salarioPromedioMensual = (sumSalarios / dividirPromedio) * 26;
            salarioPromedioDiario = sumSalarios / dividirPromedio;            
        }
        document.getElementById("sum-salarios").innerText = new Intl.NumberFormat('en-US', {maximumFractionDigits: 2}).format(sumSalarios);        
        document.getElementById('salario-promedio-mensual').innerText = new Intl.NumberFormat('en-US', {maximumFractionDigits: 2}).format(salarioPromedioMensual);
        document.getElementById('salario-promedio-diario').innerText = new Intl.NumberFormat('en-US', {maximumFractionDigits: 2}).format(salarioPromedioDiario);
    }    
}

function prestaciones(){    
    let salarioPromedioDiario = Number(document.getElementById('salario-promedio-diario').textContent.replaceAll(',',''));
    // *Calcular Pre-Aviso
    let montoPreAviso = 0.00;
    if(!document.getElementById('chkPreAviso').checked){        
        let salarioPromedioDiario = Number(document.getElementById('salario-promedio-diario').textContent.replaceAll(',',''));
        let diasPreaviso = 0;        
        let dividirPreaviso = document.getElementById('calculo-ordinario').checked ? 23.83 : 26;               
        if(dividirPromedio >= 3 && dividirPromedio < 6){
            diasPreaviso = 7;
        }
        else if(dividirPromedio >= 6 && dividirPromedio <= 11){
            diasPreaviso = 14;
        }
        else if(dividirPromedio > 11){
            diasPreaviso = 28;
        }
        montoPreAviso = salarioPromedioDiario * diasPreaviso;        
        document.getElementById('preAviso').textContent = new Intl.NumberFormat('en-US', {maximumFractionDigits: 2}).format(montoPreAviso);        
    }
    else{
        montoPreAviso = 0.00;
        document.getElementById('preAviso').textContent = new Intl.NumberFormat('en-US', {maximumFractionDigits: 2}).format(montoPreAviso);        
    }
    let montoCesantia = 0.00;
    // *Calcular Cesantia
    if(document.getElementById('chkCesantia').checked){                  
        let diasPagar = 0
        if(dividirPromedio >= 3 && dividirPromedio < 6){
            diasPagar = 6;
        }
        else if(dividirPromedio >= 6 && dividirPromedio <= 11){
            diasPagar = 13;
        }
        else if(dividirPromedio >= 12 && yearsTrabajados < 6){            
            diasPagar = 21 * yearsTrabajados
            if(mesesTrabajados >= 3 && mesesTrabajados < 6){
                diasPagar += 6;
            }
            else if(mesesTrabajados >= 6 && mesesTrabajados <= 11){
                diasPagar += 13;
            }            
        }
        else if(dividirPromedio >= 12 && yearsTrabajados >= 6){            
            diasPagar = 23 * yearsTrabajados
            if(mesesTrabajados >= 3 && mesesTrabajados < 6){
                diasPagar += 6;
            }
            else if(mesesTrabajados >= 6 && mesesTrabajados < 11){
                diasPagar += 13;
            }            
        }        
        montoCesantia = salarioPromedioDiario * diasPagar;
        document.getElementById('cesantia').textContent = new Intl.NumberFormat('en-US', {maximumFractionDigits: 2}).format(montoCesantia);        
    }
    else{
        montoCesantia = 0.00;
        document.getElementById('cesantia').textContent = new Intl.NumberFormat('en-US', {maximumFractionDigits: 2}).format(montoCesantia);        
    }

    let montoVacaciones = 0.00;
    // *Calcular Vacaciones
    if(!document.getElementById('chkVacaciones').checked){
        let diasVacaiones = 0;        
        let ultimoSueldo = Number(inputTotal[dividirPromedio - 1].value.replaceAll(',',''));
        let dividir = document.getElementById('calculo-ordinario').checked ? 23.83 : 26;                                     
        if(yearsTrabajados < 1 && mesesTrabajados === 5){
            diasVacaiones = 6
        }
        else if (yearsTrabajados < 1 && mesesTrabajados === 6){
            diasVacaiones = 7
        }
        else if (yearsTrabajados < 1 && mesesTrabajados === 7){
            diasVacaiones = 8
        }
        else if (yearsTrabajados < 1 && mesesTrabajados === 8){
            diasVacaiones = 9
        }
        else if (yearsTrabajados < 1 && mesesTrabajados === 9){
            diasVacaiones = 10
        }
        else if (yearsTrabajados < 1 && mesesTrabajados === 10){
            diasVacaiones = 11
        }
        else if (yearsTrabajados < 1 && mesesTrabajados === 11){
            diasVacaiones = 12
        }
        else if(yearsTrabajados > 0 && yearsTrabajados < 5){
            diasVacaiones = 14;
        }
        else if(yearsTrabajados >= 5 ){
            diasVacaiones = 18;
        }  
        else{
            diasVacaiones = 0;
        }
        if(document.getElementById("periodo-mensual").checked){ 
            montoVacaciones = (ultimoSueldo / dividir) * diasVacaiones;            
        }    
        else if (document.getElementById("periodo-quincenal").checked){ 
            montoVacaciones = ((ultimoSueldo / dividir) * diasVacaiones) * 2;            
        }    
        else if (document.getElementById("periodo-semanal").checked){ 
            montoVacaciones = ((ultimoSueldo / dividir) * diasVacaiones) * 2 * 2.1663;            
        }      
        else{
            let multiplicar = document.getElementById('calculo-ordinario').checked ? 5.5 : 6.0010;                                     
            montoVacaciones = ((ultimoSueldo / dividir) * diasVacaiones) * 2 * 2.1663 * multiplicar;            
        }
        document.getElementById('vacaciones').textContent = new Intl.NumberFormat('en-US', {maximumFractionDigits: 2}).format(montoVacaciones);        
    }
    else{
        montoVacaciones = 0.00;
        document.getElementById('vacaciones').textContent = new Intl.NumberFormat('en-US', {maximumFractionDigits: 2}).format(montoVacaciones);        
    }
    let salarioNavidad;        
    // *Calcular Salario Navidad
    if(document.getElementById('chkSalarioNavidad').checked){             
        let diasSumar = 0;
        let mesesSumar = 1;
        let diasDelMes = 1;
        let fechaSalida = inputFechaSalida.value;        
        fechaSalida = fechaSalida.split('-');
        let salariosPromediosMensual = Number(document.getElementById('salario-promedio-mensual').textContent.replaceAll(',',''));            
        if((diasTrabajados > 0 || mesesTrabajados > 0 ) && yearIngreso === yearSalida){                        
            mesesSumar = mesesTrabajados;
            diasSumar = diasTrabajados;
            diasDelMes = new Date(fechaSalida[0], fechaSalida[1], 0).getDate();
            salarioNavidad = ((salariosPromediosMensual * (mesesSumar + (diasSumar / diasDelMes))) / 12);
        }
        else{                                    
            let fechaOpcional = dateFns.add(new Date(fechaSalida),{
                years: 0,
                months: 0,
                weeks: 0,
                days: 1,
                hours: 0,
                minutes: 0,
                seconds: 0
            })
            let intervalo = dateFns.intervalToDuration({    
                start: new Date([fechaOpcional[0], '01', '01']),
                end: new Date(fechaOpcional)
            })                                                    
            mesesSumar = intervalo.months;
            diasSumar = intervalo.days;
            diasDelMes = dateFns.getDaysInMonth(new Date(fechaOpcional))
            salarioNavidad = ((salariosPromediosMensual * (mesesSumar + (diasSumar / diasDelMes))) / 12);           
        }                
        document.getElementById('navidad').textContent = new Intl.NumberFormat('en-US', {maximumFractionDigits: 2}).format(salarioNavidad);        
    }
    else{
        salarioNavidad = 0.00;
        document.getElementById('navidad').textContent = new Intl.NumberFormat('en-US', {maximumFractionDigits: 2}).format(salarioNavidad);        
    }
}

function calcularTotal(){
    let preAviso, cesantia, vacaciones, navidad, total;
    preAviso = Number(document.getElementById('preAviso').textContent.replaceAll(',',''));    
    cesantia = Number(document.getElementById('cesantia').textContent.replaceAll(',',''));    
    vacaciones = Number(document.getElementById('vacaciones').textContent.replaceAll(',',''));    
    navidad = Number(document.getElementById('navidad').textContent.replaceAll(',',''));    
    total = preAviso + cesantia + vacaciones + navidad;
    document.getElementById('spanTotal').textContent = new Intl.NumberFormat('en-US', {maximumFractionDigits: 2}).format(total);        
}

function calcularPrestaciones(){
    let fechaIngreso = inputFechaIngreso.value;
    let fechaSalida = inputFechaSalida.value;
    let tiempoTrabajado;        
    if(validarFechas(fechaIngreso, fechaSalida)){                                
        tiempoTrabajado = calcularTiempoTrabajado(fechaIngreso, fechaSalida);              
        let inputsTotal = document.querySelectorAll('.input-total');
        let sumSalarios = calcularSalarios(inputsTotal);                
        calcularSalariosBasadoOpciones(sumSalarios)
        prestaciones()
        calcularTotal()
    }
    else{   
        alert("Debes introducir fechas validas")        
    }
    document.getElementById('spanTiempoLaborado').innerText = formatearTiempoTrabajado(tiempoTrabajado)        
    
}


radioOrdinario.addEventListener('click', function(){    
    document.querySelector('.container-texto-ordinario').classList.add('block');    
    document.querySelector('.container-texto-ordinario').classList.remove('hidden');
    document.querySelector('.container-texto-intermitente').classList.add('hidden'); 
    document.querySelector('.container-texto-intermitente').classList.remove('block');   
})

radioIntermitente.addEventListener('click', function(){
    document.querySelector('.container-texto-intermitente').classList.add('block'); 
    document.querySelector('.container-texto-intermitente').classList.remove('hidden');   
    document.querySelector('.container-texto-ordinario').classList.add('hidden');    
    document.querySelector('.container-texto-ordinario').classList.remove('block');
})

btnCalcular.addEventListener('click', calcularPrestaciones)
btnLimpiar.addEventListener('click', function (){
    window.location.reload();
})

