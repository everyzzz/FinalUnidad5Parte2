import { urlExpiredPayments,urlPayments,urlUsers,urlServices } from "./utils/urls.js";

const containerPays = document.querySelector(".row");
const containerExpired = document.querySelector(".two");

const userDiv = document.querySelector("#user-data"); // user name
const pageService = document.querySelector(".head1"); // admin view


const imgDiv = document.querySelector("#img-profile"); // img view
// Almacenamos la ubicación de los botones que ocultan pagos vigentes y vencidos
let btnPay = document.querySelector("#boton-ocultar-payments") // identificar el boton ocultar
let btnExp = document.querySelector("#boton-ocultar-expirets") // identificar el boton ocultar


/*--------------------------- LocalStorage ----------------------------*/
//Para almacenar el total de payments y expired. Y las funciones para agregar al local
//Nota: Estos datos se almacenan en el local para usarlos en la paginación

let numPaymentsStorage = JSON.parse(localStorage.getItem("numPayments")) ?? [];
function addNumPayments(numPay) {
    numPaymentsStorage.push(numPay);
    localStorage.setItem("numPayments", JSON.stringify(numPaymentsStorage))
}

let numExpiretsStorage = JSON.parse(localStorage.getItem("numExpirets")) ?? [];
function addNumExpirets(numExp) {
    numExpiretsStorage.push(numExp);
    localStorage.setItem("numExpirets", JSON.stringify(numExpiretsStorage))
}


// Obteniendo la url de la imagen
let obtenerImg = JSON.parse(localStorage.getItem("img")) ?? [];
let lastImg = obtenerImg[obtenerImg.length -1];


// Obteniendo Token
let obtenerToken = JSON.parse(localStorage.getItem("tokens")) ?? [];
let lastToken = obtenerToken[obtenerToken.length - 1];

// Obteniendo Usuario
let obtenerUser = JSON.parse(localStorage.getItem("user")) ?? [];
let lastUser = obtenerUser[obtenerUser.length - 1];
/*--------------------------- Fin LocalStorage ----------------------------*/

/*-----Almacenar Datos User-----*/
let userGetData = {} // datos a mostrar
export let getUserOrAdmin = {} // datos a
async function getUsersData(){
    const response = await fetch(urlUsers);
    const data = await response.json();
    data.forEach((users)=>{
        let id = users.id
        let name = users.username
        let staff = users.is_staff
        userGetData[id]= name 
        getUserOrAdmin[id] = staff
    })
    // Admin Validator
    if (getUserOrAdmin[lastUser]){
        pageService.innerHTML += `
        <a href="./addService.html" class="navbar-brand m-1 text-black" style="padding: 15px;">Servicios</a>
        `
    }

    // Pintamos la imagen del usuario, de paso, le damos estilos al nombre del usuario
    imgDiv.innerHTML = `<img style="width: 25%; background: #E0E0E0; border-radius:50%" src="https://avatars.dicebear.com/api/avataaars/${userGetData[lastUser]}15.svg"/>`

    userDiv.innerHTML = `<span style="font-family: Tahoma; text-transform: capitalize; text-size:25px"><b>${userGetData[lastUser]}</b></span>`//User Data
}
getUsersData()
/*-----Fin almacen-----*/

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

//* Vistas
async function getPayments(){
    try{

        // Pays Response
        const response = await fetch(urlPayments,{
            headers:{
                Authorization: `Bearer ${lastToken}`
            }   
        });

        // Expired Pays Response
        const response2 = await fetch(urlExpiredPayments,{
            headers:{
                Authorization: `Bearer ${lastToken}`
            }
        });

        // Redirige al login
        if (response.status === 401 || response2.status === 401 ){
            Swal.fire( 
                "Tu token ha vencido",
                "Registrate nuevamente",
                "error",
            ).then((result)=>{
                if(result.isConfirmed){
                    window.location.replace("/templates/login/login.html") 
                }else{
                    window.location.replace("/templates/login/login.html") 
                }
            });
            removeLocalStorage()
        }

        // Render Pays
        const data = await response.json();
        addNumPayments(data.count)  // Agregamos en el local el total de datos
        data.results.forEach((pays, index) =>{
            containerPays.innerHTML+=`
            <div id="payment-${index}" class="payment card col-md-auto">
                <div class="card-body rounded text-center" style="font-size:17px">
                    <img class="rounded" style="width: 200px" src="${image[pays.service_id]}" />
                    <p class="mt-2"><span style="color:green">Servicio:</span> ${nameImg[pays.service_id]}</p>
                    <p><span style="color:green">Fecha de pago:</span> ${pays.payment_date}</p>
                    <p><span style="color:green">Monto:</span> S/.${pays.amount}</p>
                </div>                    
            </div>    
            `
        })
        
        
        // al refrescar la pagina, damos click al boton ver menos...
          setTimeout(()=>{
            btnPay.click();
        }, );
        

        // Render Expired Pays
        const data2 = await response2.json();
        addNumExpirets(data2.count) // Agregamos en el local el total de datos
        data2.results.forEach((expired, index)=>{
            //<p>IDpago: ${expired.payment_user_id}</p>
            containerExpired.innerHTML+=`
            <div id="expired-${index}" class="card col-md-auto bg-black shadow-lg">
                <div class="card-body rounded text-center bg-alert">
                    <img class="rounded" style="width: 200px;" src="${image[getIdPayIdUser[expired.payment_user_id]]}" />
                    <p class="mt-2 text-white"><span class="text-danger">Servicio:</span> ${nameImg[getIdPayIdUser[expired.payment_user_id]]}</p>
                    <p class="text-white"><span class="text-danger">Fecha de pago:</span> ${fechaPago[expired.payment_user_id]}</p>
                    <p class="text-white"><span class="text-danger">Monto:</span> S/.${montoPago[expired.payment_user_id]}</p>
                    <p class="text-white"><span class="text-danger">Penalidad:</span> S/.${expired.penalty_free_amount}</p>
                </div>                    
            </div>  
            `
        });

         // al refrescar la pagina, damos click al boton ver menos...
         setTimeout(()=>{
            btnExp.click();
        }, );

    }catch(error){
        console.log(error)
    }
}
getPayments()


//! Borrar Local Storage
function removeLocalStorage(){
    localStorage.clear();
}