/* Local */
// const urlServices = 'http://127.0.0.1:8000/v2/services/'
// const urlPayments = 'http://127.0.0.1:8000/v2/payment-users/'
// const urlExpiredPayments = 'http://127.0.0.1:8000/v2/expired-payment/'
// const urlUsers = 'http://127.0.0.1:8000/users/'

/* Railway */
const urlServices = 'https://finalunidad5-production.up.railway.app/v2/services/'
const urlPayments = 'https://finalunidad5-production.up.railway.app/v2/payment-users/'
const urlExpiredPayments = 'https://finalunidad5-production.up.railway.app/v2/expired-payment/'
const urlUsers = 'https://finalunidad5-production.up.railway.app/users/'

const containerPays = document.querySelector(".row");
const containerExpired = document.querySelector(".two");

const userDiv = document.querySelector("#user-data"); // user name
const pageService = document.querySelector(".head1"); // admin view


/*--------------------------- LocalStorage ----------------------------*/
// Obteniendo Token
let obtenerToken = JSON.parse(localStorage.getItem("js.tokens")) ?? [];
let lastToken = obtenerToken[obtenerToken.length - 1];
//console.log("Último token",lastToken);


// Obteniendo Usuario
let obtenerUser = JSON.parse(localStorage.getItem("js.user")) ?? [];
let lastUser = obtenerUser[obtenerUser.length - 1];
//console.log("Último User",lastUser);
/*--------------------------- Fin LocalStorage ----------------------------*/

/*-----Almacenar Datos User-----*/
let userGetData = {} // datos a mostrar
let getUserOrAdmin = {} // datos a
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
    userDiv.innerHTML = `${userGetData[lastUser]}`//User Data
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

        // Pays Respone
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
            }});
            removeLocalStorage()
        }

        // Render Pays
        const data = await response.json();
        data.results.forEach((pays) =>{
            containerPays.innerHTML+=`
            <div class="card col-md-auto">
                <div class="card-body rounded text-center" style="font-size:17px">
                    <img class="rounded" style="width: 200px" src="${image[pays.service_id]}" />
                    <p class="mt-2"><span style="color:green">Servicio:</span> ${nameImg[pays.service_id]}</p>
                    <p><span style="color:green">Fecha de pago:</span> ${pays.payment_date}</p>
                    <p><span style="color:green">Monto:</span> ${pays.amount}</p>
                </div>                    
            </div>    
            `
        })
    
    
        // Render Expired Pays
        const data2 = await response2.json();
        data2.results.forEach((expired)=>{
            //<p>IDpago: ${expired.payment_user_id}</p>
            containerExpired.innerHTML+=`
            <div class="card col-md-auto bg-black shadow-lg">
                <div class="card-body rounded text-center bg-alert">
                    <img class="rounded" style="width: 200px;" src="${image[getIdPayIdUser[expired.payment_user_id]]}" />
                    <p class="mt-2 text-white"><span class="text-danger">Servicio:</span> ${nameImg[getIdPayIdUser[expired.payment_user_id]]}</p>
                    <p class="text-white"><span class="text-danger">Fecha de pago:</span> ${fechaPago[expired.payment_user_id]}</p>
                    <p class="text-white"><span class="text-danger">Monto:</span> ${montoPago[expired.payment_user_id]}</p>
                    <p class="text-white"><span class="text-danger">Penalidad:</span> ${expired.penalty_free_amount}</p>
                </div>                    
            </div>  
            `
        });

    }catch(error){
        console.log(error)
    }
}
getPayments()


// //* Pagos Expirados
// async function getExpiredPayments(){
//     try{
//         !!
//     }catch(error){
//         console.log(error)
//         if (error){
//             location.reload()
//         }
//     }

// }
//getExpiredPayments()


//! Borrar Local Storage
function removeLocalStorage(){
    localStorage.clear();
}

