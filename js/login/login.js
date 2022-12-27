/* Local */
// urlLogin = 'http://127.0.0.1:8000/users/login/'

/* Railway */
const urlLogin = 'https://finalunidad5-production.up.railway.app/users/login/'


//* LocalStorage ----------------------------------------------------
let tokenStorage = JSON.parse(localStorage.getItem("js.tokens")) ?? [];

let userStorage = JSON.parse(localStorage.getItem("js.user")) ?? [];

function addUser(user){
    userStorage.push(user);
    localStorage.setItem("js.user", JSON.stringify(userStorage));
}

function addToken(token){
    tokenStorage.push(token);
    localStorage.setItem("js.tokens", JSON.stringify(tokenStorage));
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
        //console.log(body)
        //console.log(response)

        const data = await response.json();
        if (data.id){
            console.log(data); //obteniendo datos

            const getterUser = data.id; // obteniendo id
            //console.log(getterUser)
            addUser(getterUser) //añadiendo user al localstorage

            const getterToken = data.tokens.access;
            //console.log(getterToken) //obteniendo token
            addToken(getterToken) //añadiendo user al localstorage

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