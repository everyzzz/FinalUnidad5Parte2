const urlPayments = 'http://127.0.0.1:8000/v2/payment-users/'
const urlServices = 'http://127.0.0.1:8000/v2/services/'
const urlUsers = 'http://127.0.0.1:8000/users/'

const form = document.querySelector("form");
const inputs = document.querySelectorAll("input");
let selectIdUser = document.querySelector("#id-user");
let selectIdService = document.querySelector("#id-service");

const userDiv = document.querySelector("#user-data"); // user name
const pageService = document.querySelector(".head1"); // admin view


/*--------------------------- LocalStorage ----------------------------*/
// Obteniendo Usuario
let obtenerUser = JSON.parse(localStorage.getItem("js.user")) ?? [];
let lastUser = obtenerUser[obtenerUser.length - 1];
//console.log("Último User",lastUser);
/*--------------------------- Fin LocalStorage ----------------------------*/

/*-----Almacenar Datos User-----*/
let userGetData = {} // datos a mostrar
let getUserOrAdmin = {}
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



// * Obtener ID Servicios
async function getIdService(){
    const responseIdService = await fetch(urlServices);
    const dataIdService = await responseIdService.json();
    //console.log(dataIdService)
    for (let i = 0; i < dataIdService.length; i++) {
        let option = document.createElement("option");
        option.value = dataIdService[i].id;
        option.text = dataIdService[i].name;
        selectIdService.add(option);
    }     
}
getIdService()


form.onsubmit = async function(event){
    event.preventDefault();
    const body = {
        user_id : lastUser,
        service_id :selectIdService.value,
    };
    inputs.forEach((input) => (body[input.name] = input.value));
    try{
        const response = await fetch(urlPayments, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
        //console.log("response",response);
        //console.log("body",body)
        
        // * Validaciones
        if (response.ok){
            Swal.fire({
                text : "¡Pago Añadido!",
                icon : "success",
                showConfirmButton: true,
            }); 
        }else if (body.expiration_date === "dd/mm/aa" || body.amount === ""){
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
        Swal.fire({
            title: 'Ha ocurrido un error',
            text: `${error}`,
            icon : "error"
        });
    }

}

//! Borrar Local Storage
function removeLocalStorage(){
    localStorage.clear();
}