class Producto {
  constructor(nombre, precio, cantidad, calidad) {
    this.nombre = nombre;
    this.precio = precio;
    this.cantidad = cantidad;
    this.calidad = calidad;
  }

  toString() {
    return `Nombre: ${this.nombre}, Precio: $${this.precio.toFixed(
      2
    )}, Cantidad: ${this.cantidad}, Calidad: ${this.calidad}°`;
  }
}

const nuevo_objeto = (nombre, precio, cantidad, calidad) => {
  try {
    if (!nombre) {
      return { error: "EL NOMBRE NO PUEDE ESTAR VACIO", obj: null };
    }
    if (isNaN(precio) || isNaN(cantidad) || isNaN(calidad)) {
      return { error: "ALGUNO DE LOS VALORES NO ES VALIDO", obj: null };
    }
    return {
      error: null,
      obj: new Producto(nombre, precio, cantidad, calidad),
    };
  } catch (error) {
    return { error: "ERROR INESPERADO AL CREAR EL OBJETO", obj: null };
  }
};

const agregar = function (lista) {
  try {
    if (
      lista.some(
        (item) => item.nombre === this.nombre && item.calidad === this.calidad
      )
    ) {
      return lista;
    }
    const newList = [...lista, this];
    guardarLista(newList);
    return newList;
  } catch (error) {
    console.error("ERROR INESPERADO AL AGREGAR EL OBJETO", error);
    return lista;
  }
};

const guardarLista = (list) => {
  try {
    localStorage.setItem("lista", JSON.stringify(list));
    console.log("Lista guardada en localStorage:", list);
  } catch (error) {
    console.error("Error al guardar la lista en localStorage:", error);
  }
};

const cargarLista = () => {
  try {
    const listaJSON = localStorage.getItem("lista");
    console.log("Datos crudos de localStorage:", listaJSON);
    if (listaJSON) {
      const listaRaw = JSON.parse(listaJSON);
      if (!Array.isArray(listaRaw)) {
        console.error("Datos en localStorage no son un array válido");
        localStorage.removeItem("lista");
        return [];
      }
      const lista = listaRaw
        .map((item) => {
          if (
            !item.nombre ||
            isNaN(item.precio) ||
            isNaN(item.cantidad) ||
            isNaN(item.calidad)
          ) {
            console.error("Elemento inválido en localStorage:", item);
            return null;
          }
          return new Producto(
            item.nombre,
            item.precio,
            item.cantidad,
            item.calidad
          );
        })
        .filter((item) => item !== null);
      console.log("Lista cargada desde localStorage:", lista);
      return lista;
    }
    console.log("No hay datos en localStorage, devolviendo array vacío");
    return [];
  } catch (error) {
    console.error("Error al cargar la lista desde localStorage:", error);
    localStorage.removeItem("lista");
    return [];
  }
};

const mostrar = (lista) => {
  if (lista.length === 0) {
    return "NO HAY OBJETOS PARA MOSTRAR";
  }
  return lista.map((item) => item.toString()).join("\n");
};

const eliminar = function (lista) {
  try {
    const newList = lista.filter(
      (item) => !(item.nombre === this.nombre && item.calidad === this.calidad)
    );
    guardarLista(newList);
    return newList;
  } catch (error) {
    console.error("ERROR INESPERADO AL ELIMINAR EL OBJETO", error);
    return lista;
  }
};

function mostrarProductosInterfaz() {
  if (typeof mostrar !== "function" || typeof lista === "undefined") {
    document.getElementById("mensaje").textContent =
      "Error: Funcionalidad no disponible";
    document.getElementById("mensaje").classList.add("error");
    return;
  }
  const tbody = document.getElementById("lista-productos");
  if (!tbody) {
    document.getElementById("mensaje").textContent =
      "Error: No se encontró la tabla de productos";
    document.getElementById("mensaje").classList.add("error");
    return;
  }
  tbody.innerHTML = "";
  const listaJSON = localStorage.getItem("lista");
  if (!listaJSON) {
    document.getElementById("mensaje").textContent =
      "Error: No se encontraron datos en localStorage";
    document.getElementById("mensaje").classList.add("error");
    return;
  }
  if (lista.length === 0) {
    document.getElementById("mensaje").textContent =
      "No hay productos para mostrar";
    return;
  }
  lista.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.nombre}</td>
      <td>$${item.precio.toFixed(2)}</td>
      <td>${item.cantidad}</td>
      <td>${item.calidad}°</td>
    `;
    tbody.appendChild(row);
  });
  document.getElementById("mensaje").textContent = "";
}

// Ejecutar mostrarProductosInterfaz solo en mostrar_producto.html
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("mostrar_producto.html")) {
    mostrarProductosInterfaz();
  }
});

function handleAgregar(event) {
  event.preventDefault();
  if (typeof agregar !== "function" || typeof lista === "undefined") {
    document.getElementById("mensaje").textContent =
      "Error: Funcionalidad no disponible";
    document.getElementById("mensaje").classList.add("error");
    return;
  }
  const formData = new FormData(event.target);
  const nombre = formData.get("nombre")?.trim();
  const precio = Number(formData.get("precio"));
  const cantidad = Number(formData.get("cantidad"));
  const calidad = Number(formData.get("calidad"));
  const { error, obj } = nuevo_objeto(nombre, precio, cantidad, calidad);
  const mensaje = document.getElementById("mensaje");
  if (error || !obj) {
    mensaje.textContent = error;
    mensaje.classList.add("error");
    mensaje.classList.remove("success");
    return;
  }
  lista = agregar.call(obj, lista);
  mensaje.textContent = "Producto agregado correctamente";
  mensaje.classList.add("success");
  mensaje.classList.remove("error");
  event.target.reset();
  console.log("Producto agregado, lista actual:", lista);
}

function handleEliminar(event) {
  event.preventDefault();
  if (typeof eliminar !== "function" || typeof lista === "undefined") {
    document.getElementById("mensaje").textContent =
      "Error: Funcionalidad no disponible";
    document.getElementById("mensaje").classList.add("error");
    return;
  }
  const formData = new FormData(event.target);
  const obj = new Producto(
    formData.get("nombre")?.trim(),
    0,
    0,
    Number(formData.get("calidad"))
  );
  const mensaje = document.getElementById("mensaje");
  if (!obj.nombre || isNaN(obj.calidad)) {
    mensaje.textContent = "Error: Ingrese un nombre y una calidad válidos";
    mensaje.classList.add("error");
    mensaje.classList.remove("success");
    return;
  }
  const originalLength = lista.length;
  lista = eliminar.call(obj, lista);
  if (lista.length < originalLength) {
    mensaje.textContent = "Producto eliminado correctamente";
    mensaje.classList.add("success");
    mensaje.classList.remove("error");
  } else {
    mensaje.textContent = "El producto no existe";
    mensaje.classList.add("error");
    mensaje.classList.remove("success");
  }
  event.target.reset();
  console.log("Producto eliminado, lista actual:", lista);
}

let lista = cargarLista();

function agregarProducto() {
  window.location.href = "agregar_producto.html";
}

function mostrarProductos() {
  window.location.href = "mostrar_producto.html";
}

function eliminarProductos() {
  window.location.href = "eliminar_producto.html";
}

function salir() {
  console.log(
    "Botón Salir clicado. Intentando cerrar la ventana del navegador."
  );
  console.log(
    "Nota: La ventana solo se cerrará si fue abierta por un script (por ejemplo, con window.open)."
  );
  window.close();
}
