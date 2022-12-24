//const urlLogin = 'http://127.0.0.1:8000/users/login/'
const urlLogin = 'https://finalunidad5-production.up.railway.app/users/login/'

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
			if (data) {
				console.log(data); //obteniendo datos
				const setToken = data.access;
                console.log(setToken) //obteniendo token
            }
        
        if (data.id){
            Swal.fire({
                text : "Registrado correctamente",
                icon : "success",
                showConfirmButton: true,
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
        Swal.fire({
            title : "¡Error!",
            text : `${error}`,
            icon : "error",
            showConfirmButton: true,
        });
    }
};
