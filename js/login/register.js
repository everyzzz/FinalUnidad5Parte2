//const urlRegister = 'http://127.0.0.1:8000/users/signup/'
const urlRegister = 'https://finalunidad5-production.up.railway.app/users/signup/'

const form = document.querySelector("form");
const inputs = document.querySelectorAll("input");

form.onsubmit = async function(event){
    event.preventDefault();
    const body = {}
    
    inputs.forEach((input) => (body[input.name] = input.value));
    try{
        const response = await fetch(urlRegister,{
            method : "POST",
            headers : {
                "Content-type" : "application/json",
            },
            body : JSON.stringify(body),
        });
        //console.log(response)
        //console.log(body)
        if (response.ok){
            Swal.fire({
                text : "¡Usuario Registrado!",
                icon : "success",
                showConfirmButton: true,
            }); 
        }else if (body.email === "" || body.username === ""|| body.password === ""){
            Swal.fire({
                text : "¡Por favor, llena todos los campos!",
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
            title : "¡Error!",
            text : `${error}`,
            icon : "error",
            showConfirmButton: true,
        });
    }
};