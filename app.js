localStorage.clear();

//LOGIN
const usuario            = document.getElementById("usuario");
const edad               = document.getElementById("edad");
const botonLogin         = document.getElementById("botonLogin");
const videoLogin         = document.getElementById("videoLogin");
const containerPrincipal = document.getElementById("containerPrincipal");
const formGroup          = document.getElementById("form-group"); 
const userBienvenido     = document.getElementById('userBienvenido');

botonLogin.addEventListener("click", function(){

    if(edad.value<18){
        Toastify({
            text: "Debe ser mayor de 18 años para ingresar",
            duration: 3000
            }).showToast();
            return
     }else{

        setTimeout(() => {
            containerPrincipal.style.visibility = "hidden";
            videoLogin.style.visibility = "hidden";
            formGroup.style.visibility = "hidden";

            userBienvenido.innerText = "Bienvenido "+usuario.value;            
        }, 850);

        }    
})


//FUNCIONAMIENTO DE BUSCADOR
document.getElementById("iconoBusqueda").addEventListener("click", mostrar_buscador);
document.getElementById("cover-ctn-search").addEventListener("click", ocultar_buscador);
document.getElementById("searchButton").addEventListener("click", buscarNombre);

//Declarando variables
bars_search      = document.getElementById("buscar2");
cover_ctn_search = document.getElementById("cover-ctn-search");
inputSearch      = document.getElementById("inputSearch");

//Funcion para mostrar el buscador
function mostrar_buscador(){

    bars_search.style.top = "155px";
    cover_ctn_search.style.display = "block";
    inputSearch.focus();

}

//Funcion para ocultar el buscador
function ocultar_buscador(){

    bars_search.style.top = "-10px";
    cover_ctn_search.style.display = "none";
    inputSearch.value = "";

}

//Funcion Scroll Up
document.getElementById("button-up").addEventListener("click",scrollUp);

function scrollUp(){
    const currentScroll = document.documentElement.scrollTop;
    if ( currentScroll > 0 ){
        window.requestAnimationFrame(scrollUp);
        window.scrollTo(0,currentScroll-(currentScroll/20))
    }
}

const buttonUp = document.getElementById("button-up");

window.onscroll = function(){
    const scroll = document.documentElement.scrollTop;

    if ( scroll > 300){
        buttonUp.style.transform = "scale(1)";
    }else if( scroll < 300 ){
        buttonUp.style.transform = "scale(0)";
    }
}


//Funcion ventana modal
const cerrar = document.getElementById('close');
const modal  = document.getElementById('modal');
const modalC = document.getElementById('modal-container');


//Funcion ventana compra
const informacionCompra = document.getElementById('info-Compra');
const contenedorCompra  = document.getElementById('cnt-Compra');
const productosCompra   = document.getElementById('movies-Compra');
const contenedor        = document.querySelector('#container');
const iconoCarrito      = document.getElementById('iconoCarrito');
const numero            = document.getElementById("numero");
const total             = document.getElementById('total');
const body              = document.querySelector("body");
const x                 = document.getElementById('x');
const vaciar            = document.getElementById("vaciar");
const finalizar         = document.getElementById("finalizar");


function allEventListeners()
{    
    contenedorCompra.classList.add("none")
    window.addEventListener('DOMContentLoaded', cargarPeliculas);
}

allEventListeners();

let movies        = [];
let moviesCarrito = [];
let valorTotal    = 0;
let preciounit;
let cantidadTotal = 0;


// cargarPeliculas()

function cargarPeliculas()
{
    movies        = JSON.parse(localStorage.getItem('movies')) || []
    moviesCarrito = JSON.parse(localStorage.getItem('moviesCarrito')) || [];
}

//Obtener peliculas desde API
const url = './json/peliculas.json';

fetch(url)
.then(response => response.json())
.then(data => {

    movies = data.slice();

    localStorage.setItem('movies',JSON.stringify(movies));

    for (let i = 0; i < movies.length; i++) {

        container.innerHTML +=
            `<div>
                <img src="${movies[i].image}"/>
                <div class="cnt-title">
                    <h2>${movies[i].title}</h2>
                </div>
                <div class="cnt-descrip">
                    <small>${movies[i].description}</small>
                </div>
                <p class="precio">$${1000}</p>
                <br></br>
                <button onclick=comprar(${i})><strong>Comprar</strong></button>
            </div>
            `
    }
})
.catch(err => {window.location="./pages/error.html"});


function buscarNombre(){
    const ingresaUsuario = inputSearch.value.toLowerCase();

    const listamovie = movies.filter((elem) => elem.title.toLowerCase().includes(ingresaUsuario));

    if(listamovie.length>1){
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })
        Toast.fire({
            icon: 'warning',
            title: 'Se encontraron varios títulos con el criterio seleccionado, por favor se mas especifico'
        })
    }else if(listamovie.length == 1){
            const movieFound = movies.find((elem) => elem.title.toLowerCase().includes(ingresaUsuario));

            Swal.fire({
                title: 'Se encontro el título seleccionado!',
                text: '',
                imageUrl: movieFound.image,
                imageWidth: 400,
                imageHeight: 400,
                imageAlt: movieFound.thumbnail,
            })
        }else if(listamovie.length == 0){
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            })
            Toast.fire({
                icon: 'error',
                title: 'No se encontro el título seleccionado'
            })
        }
    }

function comprar(indice) {

    if(moviesCarrito.lenght==0){
        moviesCarrito.push({ image: movies[indice].thumbnail, title: movies[indice].title, cantidad: 1, precio: 1000})
        localStorage.setItem("moviesCarrito", JSON.stringify(moviesCarrito))
    }else{
        
        const peliBuscada = movies[indice].title;
        preciounit  = 1000;

        const indiceSeleccion = moviesCarrito.findIndex((Item) => { return Item.title == peliBuscada});

        if (indiceSeleccion != -1){
            moviesCarrito[indiceSeleccion].cantidad++;

            let cantAux = moviesCarrito[indiceSeleccion].cantidad;            
            moviesCarrito[indiceSeleccion].precio = preciounit*cantAux;
        }else{
            moviesCarrito.push({ image: movies[indice].thumbnail, title: movies[indice].title, cantidad: 1, precio: 1000 })
            localStorage.setItem("moviesCarrito", JSON.stringify(moviesCarrito))
        }
    }

    let cantidadTotal = moviesCarrito.reduce((acc,el) => acc + el.cantidad,0);    
    numero.innerHTML = cantidadTotal
    numero.style.display = "flex"
    numero.classList.add("diseñoNumero")
    return moviesCarrito
}

iconoCarrito.addEventListener("click", function(){
    if (moviesCarrito.length==0){    
            Toastify({
                text: "No hay elementos en el carrito",
                duration: 3000
                }).showToast();
    }else{
    body.style.overflow = "hidden"
    contenedorCompra.classList.remove('none')
    contenedorCompra.classList.add('cnt-Compra')
    informacionCompra.classList.add('info-Compra')
    mostrarElementosLista()
    }    
})


function mostrarElementosLista() {
    productosCompra.innerHTML = ""
    valortotal = 0
    for (let i = 0; i < moviesCarrito.length; i++){
        productosCompra.innerHTML +=
        `<div>
            <div class="img">
                <button onclick=eliminar(${i}) class="botonTrash">
                    <img src="./images/trash.png">
                </button>
                <img src="${moviesCarrito[i].image}">
                <p>${moviesCarrito[i].title}</p>
            </div>
            <p>${moviesCarrito[i].cantidad}</p>
            <p>${moviesCarrito[i].precio}</p>
        </div>
        `
        valortotal += parseInt(moviesCarrito[i].precio)
    }
    total.innerHTML = `<p>Valor Total</p> <p><span>$${valortotal}</span></p>`
}

function eliminar(indice){
    moviesCarrito.splice(indice, 1)

    let cantidadTotal = moviesCarrito.reduce((acc,el) => acc + el.cantidad,0);    
    numero.innerHTML = cantidadTotal
    if (moviesCarrito.length == 0){
        numero.classList.remove("diseñoNumero")
        numero.style.display = "none"
    }
    mostrarElementosLista()
}

x.addEventListener("click", function(){
    body.style.overflow = "auto"
    contenedorCompra.classList.add('none')
    contenedorCompra.classList.remove('cnt-Compra')
    informacionCompra.classList.remove('info-Compra')
})

vaciar.addEventListener("click", function(){
    moviesCarrito = []
    localStorage.setItem("moviesCarrito", JSON.stringify(moviesCarrito))
    mostrarElementosLista()
    let cantidadTotal = moviesCarrito.reduce((acc,el) => acc + el.cantidad,0);    
    numero.innerHTML = cantidadTotal    
    numero.classList.remove('diseñoNumero')
    numero.style.display = "none"
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'El carrito se vacio correctamente',
        showConfirmButton: false,
        timer: 1500
    })
})

finalizar.addEventListener("click", function(e){         
    moviesCarrito = []
    mostrarElementosLista()
    let cantidadTotal = moviesCarrito.reduce((acc,el) => acc + el.cantidad,0);    
    numero.innerHTML = cantidadTotal    
    numero.classList.remove('diseñoNumero')
    numero.style.display = "none"
    body.style.overflow = "auto"
    contenedorCompra.classList.add('none')
    contenedorCompra.classList.remove('cnt-Compra')
    informacionCompra.classList.remove('info-Compra')
    e.preventDefault();    
    modalC.style.opacity = "1";
    modalC.style.visibility = "visible";
    modal.classList.toggle("modal-close");
})

cerrar.addEventListener("click", function(){   
    modal.classList.toggle("modal-close");

    setTimeout(() => {
        modalC.style.opacity = "0";
        modalC.style.visibility = "hidden";
    }, 850);
})

window.addEventListener("click",function(e){   
    if(e.target==modalC)
    {   
        modal.classList.toggle("modal-close");
    
        setTimeout(() => {
            modalC.style.opacity = "0";
            modalC.style.visibility = "hidden";
        }, 850);
    }
})
