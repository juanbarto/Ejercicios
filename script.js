// Esperar a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded",()=>{
    console.log("DOM cargado");

    // === Elementos clave del DOM ===
    const btnWalls=document.getElementById("btnWalls"); // Botón para cargar productos de la API
    const fApiGallery=document.querySelector("#fetch-galeria .api-container"); // Contenedor donde se insertan las tarjetas de la API
    const listaCarrito=document.getElementById("listaCarrito"); // Contenedor visual del carrito
    const btnVaciar=document.getElementById("btnVaciar"); // Botón para vaciar el carrito

    // === Cargar datos del carrito desde localStorage o inicializar vacío ===
    let carrito=JSON.parse(localStorage.getItem("carrito")) || [];

    console.log("Elementos seleccionados correctamente");

    // === Evento: al hacer clic en el botón de cargar productos ===
    btnWalls.addEventListener("click",obtenerProductos);

    // === Función para obtener productos aleatorios de la API ===
    function obtenerProductos(){
        fetch("https://fakestoreapi.com/products")
            .then(res=>res.json())
            .then(data=>{
                const seleccionados=[];
                while (seleccionados.length<5){
                    const random=data[Math.floor(Math.random()*data.length)];
                    if (!seleccionados.includes(random)){
                        seleccionados.push(random);
                    }
                }
                renderizarProductos(seleccionados); // Insertar productos en el DOM
            })
            .catch(error=>{
                console.error("Error al cargar productos:", error);
                fApiGallery.innerHTML="<p>Error al cargar productos.</p>";
            });
    }

    // === Función que crea dinámicamente tarjetas con los productos traídos por la API ===
    function renderizarProductos(productos){
        productos.forEach(producto=>{
            const tarjeta=document.createElement("div");
            tarjeta.className="card";

            tarjeta.innerHTML=`
                <img src="${producto.image}" alt="${producto.title}" width="100">
                <p>${producto.title}</p>
                <div class="precio-y-boton">
                    <span class="precio">$${producto.price}</span>
                    <button class="agregar-btn" data-title="${producto.title}" data-price="${producto.price}" data-img="${producto.image}">Cart +</button>
                </div>
            `;

            fApiGallery.appendChild(tarjeta);
        });
    }

    // === Evento delegado: detectar clic en cualquier botón Cart + ===
    document.addEventListener("click",e=>{
        const btn=e.target.closest(".agregar-btn");
        if (btn){
            console.log("Botón agregar-btn clickeado");
            
            // Crear objeto con datos del producto seleccionado
            const item={
                title: btn.dataset.title,
                price: parseFloat(btn.dataset.price),
                img: btn.dataset.img
            };
            
            // Agregar producto al carrito
            carrito.push(item);
            // Guardar carrito actualizado en localStorage
            localStorage.setItem("carrito",JSON.stringify(carrito));
            console.log("Agregado al carrito:",item);
            // Refrescar la vista
            actualizarVista();
        }
    });

    // === Evento: Vaciar el carrito ===
    btnVaciar.addEventListener("click",()=>{
        carrito=[];
        localStorage.removeItem("carrito");
        actualizarVista();
    });

    // === Función que renderiza el contenido del carrito visual + facturación ===
    function actualizarVista(){
        listaCarrito.innerHTML = ""; // Limpiar contenedor
        const resumen=document.getElementById("resumen");
        const total=document.getElementById("total");

        btnVaciar.style.display = "block"; // Asegurar visibilidad del botón

        let sumaTotal=0;
        let resumenTexto="";

        // Iterar sobre los elementos del carrito
        carrito.forEach((item,index)=>{
            const div = document.createElement("div");
            div.className="itemCarrito";

            // Botón para eliminar individualmente un producto
            const btnEliminar=document.createElement("button");
            btnEliminar.className="boton-eliminar";
            btnEliminar.textContent="❌";

            btnEliminar.addEventListener("click",()=>{
                carrito.splice(index,1); // Eliminar item del array
                localStorage.setItem("carrito", JSON.stringify(carrito)); // Guardar nuevo array
                actualizarVista(); // Volver a renderizar
            });

            // Crear imagen del producto
            const img=document.createElement("img");
            img.src=item.img;
            img.alt=item.title;
            img.width=60;

            // Crear texto título y precio
            const titulo=document.createElement("p");
            titulo.textContent=item.title;
            const precio=document.createElement("p");
            precio.textContent=`$${item.price}`;

            // Agregar elementos al contenedor
            div.appendChild(btnEliminar);
            div.appendChild(img);
            div.appendChild(titulo);
            div.appendChild(precio);
            listaCarrito.appendChild(div);

            // Agregar línea al resumen
            resumenTexto+=`${item.title.padEnd(25)} $${item.price}\n`;
            sumaTotal+=item.price;
        });

        // Cargar resumen y total
        resumen.value=resumenTexto;
        total.textContent=`TOTAL: $${sumaTotal.toFixed(2)}`;
    }

    // === Inicializar la vista al cargar la página ===
    actualizarVista();
});