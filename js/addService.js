/* Local */
//const urlUsers = 'http://127.0.0.1:8000/users/' // url Users
//const urlServices = 'http://127.0.0.1:8000/v2/services/' // url Services

/* Railway */
const urlUsers = 'https://finalunidad5-production.up.railway.app/users/' // url Users
const urlServices = 'https://finalunidad5-production.up.railway.app/v2/services/' // url Services

const formAdd = document.querySelector("#add-service");
const formEdit = document.querySelector("#edit-service");

const inputs = document.querySelectorAll(".aS");

//const inputsEdit = document.querySelectorAll(".eS");
const inputsEditName = document.querySelectorAll("#editName");
const inputsEditDesc = document.querySelectorAll("#editDesc");
const inputsEditLogo = document.querySelectorAll("#editLogo");
const userDiv = document.querySelector("#user-data"); // user name
const pageService = document.querySelector(".head1"); // admin view
const imgDiv = document.querySelector("#img-url"); // img view

let selectIdService = document.querySelector("#service-option"); //service id

// * Obtener Data Service
async function getIdService(){
    const responseIdService = await fetch(urlServices);
    const dataIdService = await responseIdService.json();
    for (let i = 0; i < dataIdService.length; i++) {
        let option = document.createElement("option");
        option.value = dataIdService[i].id;
        option.text = dataIdService[i].id;
        selectIdService.add(option);
    }     
}
getIdService()

// Mostrar datos de forma automática
async function getDataServicio(){
    const responseIdService = await fetch(urlServices);
    const data = await responseIdService.json();
    data.forEach((data)=>{
        if (selectIdService.value == data.id){
            inputsEditName.forEach((input) => (input.value=data.name));
            inputsEditDesc.forEach((input) => (input.value=data.description));
            inputsEditLogo.forEach((input) => (input.value=data.logo));
        }
    })
}
getDataServicio()


/*--------------------------- LocalStorage ----------------------------*/
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

/*--------------------------- Fin LocalStorage ----------------------------*/


/*-----Almacenar Datos User-----*/
let userGetData = {} // datos a mostrar
let getUserOrAdmin = {} // datos admin
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
    }else{
        window.location.replace("/templates/index.html") 
    }
    if (lastImg !== "") {
        imgDiv.innerHTML = `<img src="${lastImg}" style="width: 80px; height: 80px" class="rounded-circle shadow" alt="Cinque Terre">`
    } else {
        imgDiv.innerHTML = `<img src="https://img.freepik.com/foto-gratis/disparo-gran-angular-solo-arbol-que-crece-cielo-nublado-puesta-sol-rodeada-cesped_181624-22807.jpg?w=2000" style="width: 100px; height: 80px" class="rounded-circle shadow" alt="Cinque Terre">`
    }
    userDiv.innerHTML += `<small class="text-muted"><em>${userGetData[lastUser]} </em></small>`//User Data 
}
getUsersData()
/*-----Fin almacen-----*/

/* ADD SERVICE */
formAdd.onsubmit = async function(event){
    event.preventDefault();
    const body = {};
    inputs.forEach((input) => (body[input.name] = input.value));
    try{
        const response = await fetch(urlServices, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${lastToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
        
        if (response.status === 401){ // * Redirige al login
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
        else if (response.ok){ // * Validaciones
            Swal.fire(
                "¡Servicio Añadido!",
                "",
                "success",
                ).then((result)=>{
                    if(result.isConfirmed){
                        location.reload()
                    }
                })
        }else if (body.service-name === ""|| body.description === "" || body.logo === ""){
            Swal.fire({
                text : "¡Por favor, completa los campos!",
                icon : "warning"
            });
        }
        else{
            Swal.fire({
                title: 'Oops...',
                text: '¡Algo salio mal!',
                icon : "error"
            });
        }
    
    }catch(error){
        console.log(error)
    }

}

/* EDIT SERVICE */
formEdit.onsubmit = async function(event){
    event.preventDefault();
    const body = {
        id : selectIdService.value,
    };
    inputsEditName.forEach((input) => (body[input.name] = input.value));
    inputsEditDesc.forEach((input) => (body[input.name] = input.value));
    inputsEditLogo.forEach((input) => (body[input.name] = input.value));

    try{
        const response = await fetch(urlServices+selectIdService.value+"/", {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${lastToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
        // console.log(body)
        // console.log(response)


        if (response.status === 401){ // * Redirige al login
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
        else if (response.ok){ // * Validaciones
            Swal.fire(
                "¡Servicio Editado!",
                "",
                "success",
                ).then((result)=>{
                    if(result.isConfirmed){
                        location.reload();
                    }
                })
        }
        else if (body.service-name === ""|| body.description === "" || body.logo === ""){
            Swal.fire({
                text : "¡Por favor, completa los campos!",
                icon : "warning"
            });
        }
        else{
            Swal.fire({
                title: 'Oops...',
                text: '¡Algo salio mal!',
                icon : "error"
            });
        }
    
    }catch(error){
        console.log(error)
    }

}




const viewService = document.querySelector(".services-list")
//* MOSTRAR Servicios
async function getServices(){
    try{

        // Service Response
        const response = await fetch(urlServices,{
            headers:{
                Authorization: `Bearer ${lastToken}`
            }   
        });

        // Redirige al login
        if (response.status === 401){
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

        // Render Services
        const data = await response.json();
        data.forEach((service)=>{
            viewService.innerHTML+=`
                    <tr class="text-center">
                        <td id="delete-service-id">${service.id}</td>
                        <td>${service.name}</td>
                        <td>${service.description}</td>
                        <td><img class="rounded" src="${service.logo}" style="width: 100px; height:auto;"/></td>
                    </tr>
            ` ;

        })
    }catch(error){
        console.log(error)
    }

}
getServices()

//! Borrar Local Storage
function removeLocalStorage(){
    localStorage.clear();
}