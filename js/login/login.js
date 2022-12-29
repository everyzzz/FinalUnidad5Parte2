/* Local */
// urlLogin = 'http://127.0.0.1:8000/users/login/'

/* Railway */
const urlLogin = 'https://finalunidad5-production.up.railway.app/users/login/'


//* LocalStorage ----------------------------------------------------
let tokenStorage = JSON.parse(localStorage.getItem("tokens")) ?? [];

let userStorage = JSON.parse(localStorage.getItem("user")) ?? [];

let imgStorage = JSON.parse(localStorage.getItem("img")) ?? []; // para recibir url de imagenes

function addUser(user){
    userStorage.push(user);
    localStorage.setItem("user", JSON.stringify(userStorage));
}

function addToken(token){
    tokenStorage.push(token);
    localStorage.setItem("tokens", JSON.stringify(tokenStorage));
}

/* Agregar la url en el local */
function addImg(img) {
    imgStorage.push(img)
    localStorage.setItem("img", JSON.stringify(imgStorage));
}

//console.log(tokenStorage)

/* Obtener una lista de tokens
console.log(tokenStorage)
 Bucle todos los tokens
tokenStorage.forEach((token)=>{
    console.log(token)
}); */
const form = document.querySelector("form");
const inputs = document.querySelectorAll("input");

form.onsubmit = async function(event) {
    event.preventDefault();
    const body = {}

    inputs.forEach((input)=> (body[input.name]= input.value));
    try {
        const response = await fetch(urlLogin, {
            method : "POST",
            headers : {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body), 
            
        });
        
        const getterImg = body.url;  // Enviamos el url al local
        addImg(getterImg)

        const data = await response.json(); //obteniendo datos
        if (data.id){
            //console.log(data); 

            const getterUser = data.id; // obteniendo id
            addUser(getterUser) //añadiendo user al localstorage

            const getterToken = data.tokens.access;
            addToken(getterToken) //añadiendo token al localstorage

            Swal.fire( 
                "Logeado correctamente",
                "","success"
            ).then((result)=>{
                if(result.isConfirmed){
                    window.location.replace('/templates/index.html')
            }})
    
        }else if (body.email === "" || body.password === ""){
            Swal.fire({
                text : "Por favor, rellena todos los campos",
                icon : "warning",
                showConfirmButton: true,
            });
        }else{
            Swal.fire({
                title : "¡Error!",
                text : "Usuario o contraseña incorrectos",
                icon : "error",
                showConfirmButton: true,
            });
        }
    }catch(error){
        console.log(error)
    }
};