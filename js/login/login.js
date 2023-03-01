/* Local */
urlLogin = 'http://127.0.0.1:8000/users/login/'

/* Railway */
// const urlLogin = 'https://finalunidad5-production.up.railway.app/users/login/'


//* LocalStorage ----------------------------------------------------

let userStorage = JSON.parse(localStorage.getItem("user")) ?? []; // Obtiene User
function addUser(user){ // agrega user en localStorage
    userStorage.push(user);
    localStorage.setItem("user", JSON.stringify(userStorage));
}

let tokenStorage = JSON.parse(localStorage.getItem("tokens")) ?? []; // Obtiene Token
function addToken(token){ // agrega token en localStorage
    tokenStorage.push(token);
    localStorage.setItem("tokens", JSON.stringify(tokenStorage));
}

let imgStorage = JSON.parse(localStorage.getItem("img")) ?? []; // Obtiene Url de imagenes
function addImg(img) { // agrega imagen en localStorage
    imgStorage.push(img)
    localStorage.setItem("img", JSON.stringify(imgStorage));
}
// Fin LocalStorage ----------------------------------------------------


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
        console.log(body)
        const getterImg = body.url;  // Enviamos el url al local
        console.log(body.url)
        addImg(getterImg)

        const data = await response.json(); //obteniendo datos
        if (data.id){
            //console.log(data); 

            const getterUser = data.id; // obteniendo id
            addUser(getterUser) //añadiendo user al localstorage

            const getterToken = data.tokens.access;
            addToken(getterToken) //añadiendo user al localstorage

            Swal.fire( 
                "Logeado correctamente",
                "","success"
            ).then((result)=>{
                if(result.isConfirmed){
                        window.location.replace('/templates/index.html')
                }else{
                    window.location.replace('/templates/index.html')
                }
            });
    
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