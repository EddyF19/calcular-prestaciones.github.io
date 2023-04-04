let inputSalary = document.querySelectorAll('.input-salary');
let inputComisiones = document.querySelectorAll('.input-comisiones');

inputSalary.forEach(input => {  
    let valorAnterior = 0;  
    input.addEventListener('change', function(){        
        if(!(isNaN(Number(input.value)))){  
            inputTotal = input.parentElement.parentElement.children[3].firstChild;                        
            valorInput = parseFloat(Number((input.value).replaceAll(',','')))
            valorInputTotal = parseFloat(Number((inputTotal.value).replaceAll(',','')))
            suma = (valorInput + valorInputTotal - valorAnterior);                        
            valorAnterior = valorInput;              
            input.value = new Intl.NumberFormat('en-US', {maximumFractionDigits: 2}).format(Number(valorInput));                                                         
            inputTotal.value = new Intl.NumberFormat('en-US', {maximumFractionDigits: 2}).format(Number(suma));                                                                                
        }
        else{
            input.value = '';
        }                            
    });
});

inputComisiones.forEach(input => {
    let valorAnterior = 0;  
    input.addEventListener('change', function(){        
        if(!(isNaN(Number(input.value)))){ 
            inputTotal = input.parentElement.parentElement.children[3].firstChild;                        
            valorInput = parseFloat(Number((input.value).replaceAll(',','')))
            valorInputTotal = parseFloat(Number((inputTotal.value).replaceAll(',','')))
            suma = (valorInput + valorInputTotal - valorAnterior);                        
            valorAnterior = valorInput;              
            input.value = new Intl.NumberFormat('en-US', {maximumFractionDigits: 2}).format(Number(valorInput));                                                         
            inputTotal.value = new Intl.NumberFormat('en-US', {maximumFractionDigits: 2}).format(Number(suma));            
        }
        else{
            input.value = '';
        }                            
    });
});



//     let valorAnterior = 0;  
//     input.addEventListener('change', function(){        
//         if(!(isNaN(Number(input.value)))){ 
//             valor = parseFloat(Number((input.value).replaceAll(',','')))
//             input.value = new Intl.NumberFormat('en-US', {maximumFractionDigits: 2}).format(Number(valor));
//             // input.value = parseFloat(Number(input.value)).toFixed(2);                                   
//             alert(parseFloat(valor))
//             inputTotal = input.parentElement.parentElement.children[3].firstChild;            
//             suma = (valor + parseFloat(Number(inputTotal.value)) - valorAnterior);            
//             inputTotal.value = suma.toFixed(2);            
//             valorAnterior = valor;              
//         }
//         else{
//             input.value = '';
//         }                            
//     });
// });