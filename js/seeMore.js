/*--------------------------- LocalStorage ----------------------------*/
let obtenerNumPayments = JSON.parse(localStorage.getItem("numPayments")) ?? [];
let lastNumPayments = obtenerNumPayments[obtenerNumPayments.length -1];

let obtenerNumExpirets = JSON.parse(localStorage.getItem("numExpirets")) ?? [];
let lastNumExpirets = obtenerNumExpirets[obtenerNumExpirets.length -1];

/*--------------------------- EndLocalStorage ----------------------------*/
/* Realizamos una actualización, para que se reconozcan los valores que se
almacenan en el local, ya que al logearse no reconoce el programa */
if (lastNumPayments===undefined || lastNumExpirets===undefined) {
    setTimeout(() =>{
        location.reload();
    }, 2000)
}


/*--------------------------- Ver mas y menos - Payments ----------------------------*/
function mostrarPayments(){

    for (var i=0; i<=lastNumPayments; i++) {
        document.querySelector("#payment-"+i).style.display = 'block';
    }
}

function ocultarPayments(){
    for (var i=3; i<=lastNumPayments; i++) {
        document.querySelector("#payment-"+i).style.display = 'none';
    }
}

/*--------------------------- Ver mas y menos - Expirets ----------------------------*/
function mostrarExpirets(){

    for (var i=0; i<=lastNumExpirets; i++) {
        document.querySelector("#expired-"+i).style.display = 'block';
    }
}

function ocultarExpirets(){
    for (var i=3; i<=lastNumExpirets; i++) {
        document.querySelector("#expired-"+i).style.display = 'none';
    }
}
