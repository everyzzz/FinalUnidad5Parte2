const urlUsers = 'http://127.0.0.1:8000/users/' // url Users
const urlServices = 'http://127.0.0.1:8000/v2/services/' // url Services

const formAdd = document.querySelector("#add-service");
const formEdit = document.querySelector("#edit-service");

const inputs = document.querySelectorAll(".aS");

//const inputsEdit = document.querySelectorAll(".eS");
const inputsEditName = document.querySelectorAll("#editName");
const inputsEditDesc = document.querySelectorAll("#editDesc");
const inputsEditLogo = document.querySelectorAll("#editLogo");
const userDiv = document.querySelector("#user-data"); // user name
const pageService = document.querySelector(".head1"); // admin view

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
    inputsEditName.forEach((input) => (input.value="sd"));
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
    }else{
        window.location.replace("/templates/index.html") 
    }
    userDiv.innerHTML += `${userGetData[lastUser]}`//User Data    
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
        console.log(body)
        console.log(response)
        
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
                "¡Servicio Editado!",
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

//! Borrar Local Storage
function removeLocalStorage(){
    localStorage.clear();
}



const cont = document.querySelector(".services-list")
//* MOSTRAR Servicios
async function getServices(){
    try{
        const response = await fetch(urlServices);
        const data = await response.json();
        //console.log(data)
        data.forEach((service)=>{
            cont.innerHTML+=`
            <div class="card">
                <div class="card-body">
                    <h1 style="color:green">${service.name}</h1>
                    <p>Identificador: ${service.id}</p>
                    <img src="${service.logo}" style="width: 150px; height:auto;"/>     
                </div>                    
            </div>    
            ` ;
        })
    }catch(error){
        console.log(error)
    }

}
getServices()

