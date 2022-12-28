let getNameServices = {} 
async function getName(){
    const response = await fetch(urlServices)
    const data = await response.json()
    data.forEach((name)=>{
        let id = name.id
        let nameService = name.name
        getNameServices[id] = nameService
    })
}
getName()

async function deleteService() {
    const idDelete = document.querySelector("#service-option");
    let id = idDelete.value
    Swal.fire({
      title: "¿Estás seguro?",
      text: `Eliminarás a ${getNameServices[id]} de tu lista de servicios`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await fetch(`${urlServices}${id}/`, {
          method: "DELETE",
          mode: "cors",
        }).then((response) => {
          if (response.ok) {
            if (response.ok) {
              Swal.fire(
                "¡Eliminado!",
                `Eliminaste a ${getNameServices[id]}`,
                "success"
              ).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    location.reload();
                }
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "¡Ocurrió un error!",
              });
            }
          }
        });
      }
    });
  }