//const urlPayments = 'https://finalunidad5-production.up.railway.app/v2/payment-users/'
//const urlExpiredPayments = 'https://finalunidad5-production.up.railway.app/v2/expired-payment/'

const urlServices = 'http://127.0.0.1:8000/v2/services/'
const urlPayments = 'http://127.0.0.1:8000/v2/payment-users/'
const urlExpiredPayments = 'http://127.0.0.1:8000/v2/expired-payment/'

const container = document.querySelector(".row");


async function getPayments(){
    try{
        const response = await fetch(urlPayments);
        const data = await response.json();
        //console.log(data.results)
        data.results.forEach((pays) =>{
            container.innerHTML+=renderPayments(pays)
        })
    }catch(error){
        console.log(error)
    }
}
getPayments()



async function getExpiredPayments(){
    try{
        const response = await fetch(urlExpiredPayments);
        const data = await response.json();
        //console.log(data)
        data.results.forEach((expired)=>{
            container.innerHTML+=renderExpiredPayment(expired)
        });
    }catch(error){
        console.log(error)
    }

}
getExpiredPayments()



async function getServices(){
    try{
        const response = await fetch(urlServices);
        const data = await response.json();
        //console.log(data)
        data.forEach((service)=>{
            //container.innerHTML+=renderServices(service);
        })
    }catch(error){
        console.log(error)
    }

}
getServices()





//RENDERIZADOR PAGOS
function renderPayments(pays){
    return `
    <div class="card col-md-2">
        <div class="card-body">
            <h1>Pagos</h1>
            <p>ID de servicio ${pays.service_id}</p>
            <p>Fecha de pago: ${pays.payment_date}</p>
            <p>Monto: ${pays.amount}</p>
        </div>                    
    </div>    
    `
} 

//RENDERIZADOR PAGOS EXPIRADOS
function renderExpiredPayment(expired){
    return `
    <div class="card col-md-3">
        <div class="card-body">
            <h1 style="color:red"> Expired Pagos</h1>
            <p>Id:${expired.payment_user_id}</p>
            <p>Penalty:${expired.penalty_free_amount}</p>
        </div>                    
    </div>  
    `
}



//RENDERIZADOR SERVICIOS
function renderServices(service){
    return `
    <div class="card col-md-2">
        <div class="card-body">
            <h1 style="color:green">Servicios</h1>
            <p>${service.id}</p>
            <p>${service.name}</p>
            <p>${service.logo}</p>
            
        </div>                    
    </div>    
        
    `
    
}


// PENDIENTE
//function getIdServices(){
//     const params = new URLSearchParams(location.search);
//     return params.get("id");
// }