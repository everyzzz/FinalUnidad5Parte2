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

const imgDiv = document.querySelector("#img-url"); // img view



/*--------------------------- LocalStorage ----------------------------*/
/* Para almacenar el total de payments y expired. Y las funciones para agregar al local
Nota: Estos datos se almacenan en el local para usarlos en la paginación*/
let numPaymentsStorage = JSON.parse(localStorage.getItem("numPayments")) ?? [];
let numExpiretsStorage = JSON.parse(localStorage.getItem("numExpirets")) ?? [];

function addNumPayments(numPay) {
    numPaymentsStorage.push(numPay);
    localStorage.setItem("numPayments", JSON.stringify(numPaymentsStorage))
}

function addNumExpirets(numExp) {
    numExpiretsStorage.push(numExp);
    localStorage.setItem("numExpirets", JSON.stringify(numExpiretsStorage))
}

// Obteniendo Token
let obtenerToken = JSON.parse(localStorage.getItem("tokens")) ?? [];
let lastToken = obtenerToken[obtenerToken.length - 1];
//console.log("Último token",lastToken);


// Obteniendo Usuario
let obtenerUser = JSON.parse(localStorage.getItem("user")) ?? [];
let lastUser = obtenerUser[obtenerUser.length - 1];
//console.log("Último User",lastUser);

// Obteniendo la url de la imagen
let obtenerImg = JSON.parse(localStorage.getItem("img")) ?? [];
let lastImg = obtenerImg[obtenerImg.length -1];

// Almacenamos la ubicación de los botones que ocultan pagos vigentes y vencidos
let btnPay = document.querySelector("#boton-ocultar-payments") // identificar el boton ocultar
let btnExp = document.querySelector("#boton-ocultar-expirets") // identificar el boton ocultar

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

    // Pintamos la imagen del usuario, de paso, le damos estilos al nombre del usuario
    if (lastImg !== "") {
        imgDiv.innerHTML = `<img src="${lastImg}" style="width: 80px; height: 80px" class="rounded-circle shadow" alt="Cinque Terre">`
    } else {
        imgDiv.innerHTML = `<img src="https://img.freepik.com/foto-gratis/disparo-gran-angular-solo-arbol-que-crece-cielo-nublado-puesta-sol-rodeada-cesped_181624-22807.jpg?w=2000" style="width: 100px; height: 80px" class="rounded-circle shadow" alt="Cinque Terre">`
    }
    userDiv.innerHTML = `<small class="text-muted"><em>${userGetData[lastUser]} </em></small>`//User Data
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
                    <p><span style="color:green">Monto:</span> ${pays.amount}</p>
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
                    <p class="text-white"><span class="text-danger">Monto:</span> ${montoPago[expired.payment_user_id]}</p>
                    <p class="text-white"><span class="text-danger">Penalidad:</span> ${expired.penalty_free_amount}</p>
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