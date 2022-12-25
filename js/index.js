//const urlPayments = 'https://finalunidad5-production.up.railway.app/v2/payment-users/'
//const urlExpiredPayments = 'https://finalunidad5-production.up.railway.app/v2/expired-payment/'

const urlServices = 'http://127.0.0.1:8000/v2/services/'
const urlPayments = 'http://127.0.0.1:8000/v2/payment-users/'
const urlExpiredPayments = 'http://127.0.0.1:8000/v2/expired-payment/'

const containerPays = document.querySelector(".row");
const containerExpired = document.querySelector(".two");

// Obteniendo Token
let obtenerToken = JSON.parse(localStorage.getItem("js.tokens")) ?? [];
let lastToken = obtenerToken[obtenerToken.length - 1];
//console.log("Último token",lastToken);


/*-----Almacenar logos-----*/
let image = {} 
let nameImg = {}
async function getLogoService(){
        const response = await fetch(urlServices);
        const data = await response.json();
        data.forEach((service)=>{
            let id = service.id
            let logo = service.logo
            let name = service.name
            image[id]= logo 
            nameImg[id] = name
        })
}
getLogoService()
/*-----Fin almacen-----*/


/*-----Almacenar datos de Pagos-----*/
let montoPago = {}
let fechaPago = {}
let getIdPayIdUser = {}
async function getPaymentData(){
        const response = await fetch(urlPayments);
        const data = await response.json();
        data.results.forEach((pay)=>{
            let id = pay.id
            let amount = pay.amount
            let date = pay.payment_date
            let idService = pay.service_id
            montoPago[id]= amount
            fechaPago[id]= date
            getIdPayIdUser[id] = idService
        })
}
getPaymentData()
/*-----Fin almacen-----*/


//* Pagos
async function getPayments(){
    try{
        const response = await fetch(urlPayments,{
            headers:{
                Authorization: `Bearer ${lastToken}`
            }   
        });
        const data = await response.json();
        //console.log(data.results)
        data.results.forEach((pays) =>{
            containerPays.innerHTML+=`
            <div class="card col-md-auto">
                <div class="card-body">
                    <h1>Pagos</h1>
                    <img class="rounded" src="${image[pays.service_id]}" />
                    <p>Servicio: ${nameImg[pays.service_id]}</p>
                    <p>Fecha de pago: ${pays.payment_date}</p>
                    <p>Monto: ${pays.amount}</p>
                </div>                    
            </div>    
            `
        })
    }catch(error){
        console.log(error)
    }
}
getPayments()


//* Pagos Expirados
async function getExpiredPayments(){
    try{
        const response = await fetch(urlExpiredPayments,{
            headers:{
                Authorization: `Bearer ${lastToken}`
            }
        });
        const data = await response.json();
        //console.log(data)
        data.results.forEach((expired)=>{
            containerExpired.innerHTML+=`
            <div class="card col-md-auto ">
                <div class="card-body rounded">
                    <h1 style="color:red">Expired Pagos</h1>
                    <p>IDpago: ${expired.payment_user_id}</p>
                    <img class="rounded" src="${image[getIdPayIdUser[expired.payment_user_id]]}" />
                    <p>Servicio: ${nameImg[getIdPayIdUser[expired.payment_user_id]]}</p>
                    <p>Fecha de pago: ${fechaPago[expired.payment_user_id]}</p>
                    <p>Monto: ${montoPago[expired.payment_user_id]}</p>
                    <p>Penalidad: ${expired.penalty_free_amount}</p>
                </div>                    
            </div>  
            `
        });
    }catch(error){
        console.log(error)
    }

}
getExpiredPayments()




//RENDERIZADOR PAGOS
// function renderPayments(pays){
//     return ` 
//     `
// } 

//RENDERIZADOR PAGOS EXPIRADOS
// function renderExpiredPayment(expired){
//     return `
//     `
// }


//! Borrar Local Storage
function removeLocalStorage(){
    localStorage.clear();
}


// //* Servicios
// async function getServices(){
//     try{
//         const response = await fetch(urlServices);
//         const data = await response.json();
//         //console.log(data)
//         data.forEach((service)=>{
//             //container.innerHTML+=renderServices(service);
//         })
//     }catch(error){
//         console.log(error)
//     }

// }
// getServices()

// //RENDERIZADOR SERVICIOS
// function renderServices(service){
//     return `
//     <div class="card col-md-2">
//         <div class="card-body">
//             <h1 style="color:green">Servicios</h1>
//             <p>${service.id}</p>
//             <p>${service.name}</p>
//             <p>${service.logo}</p>
            
//         </div>                    
//     </div>    
        
//     `  
// }