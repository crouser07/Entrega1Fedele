class Producto {
  constructor(nombre, precio, cantidad, calidad) {
    this.nombre = nombre;
    this.precio = precio;
    this.cantidad = cantidad;
    this.calidad = calidad;
    this.cantidadInput = cantidad; // Inicializar cantidadInput con la cantidad actual
    this.precioInput = precio; // Inicializar precioInput con el precio actual
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
    console.error("Error en nuevo_objeto (try-catch):", error);
    return { error: "ERROR INESPERADO AL CREAR EL OBJETO", obj: null };
  } finally {
    console.log("nuevo_objeto finalizado");
  }
};

const guardarLista = (list) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: list }),
      })
        .then((response) => {
          if (!response.ok) throw new Error("Error en Fetch al guardar");
          localStorage.setItem("lista", JSON.stringify(list));
          console.log("Lista guardada en localStorage:", list);
          resolve(list);
        })
        .catch((error) => {
          console.error(
            "Error al guardar la lista en localStorage (promesas):",
            error
          );
          reject(error);
        })
        .finally(() => {
          console.log("guardarLista finalizado");
        });
    }, 500);
  });
};

const cargarLista = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      fetch("https://jsonplaceholder.typicode.com/posts/1")
        .then((response) => {
          if (!response.ok) throw new Error("Error en Fetch al cargar");
          return response.json();
        })
        .then((data) => {
          console.log("Datos simulados de API externa:", data);
          const listaJSON = localStorage.getItem("lista");
          console.log("Datos crudos de localStorage:", listaJSON);
          if (listaJSON) {
            const listaRaw = JSON.parse(listaJSON);
            if (!Array.isArray(listaRaw)) {
              console.error("Datos en localStorage no son un array válido");
              localStorage.removeItem("lista");
              resolve([]);
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
            resolve(lista);
          } else {
            console.log(
              "No hay datos en localStorage, devolviendo array vacío"
            );
            resolve([]);
          }
        })
        .catch((error) => {
          console.error(
            "Error al cargar la lista desde localStorage (promesas):",
            error
          );
          localStorage.removeItem("lista");
          resolve([]);
        })
        .finally(() => {
          console.log("cargarLista finalizado");
        });
    }, 300);
  });
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
    console.error("ERROR INESPERADO AL AGREGAR EL OBJETO (try-catch):", error);
    return lista;
  } finally {
    console.log("agregar finalizado");
  }
};

const eliminar = function (lista) {
  try {
    const newList = lista.filter(
      (item) => !(item.nombre === this.nombre && item.calidad === this.calidad)
    );
    guardarLista(newList);
    return newList;
  } catch (error) {
    console.error("ERROR INESPERADO AL ELIMINAR EL OBJETO (try-catch):", error);
    return lista;
  } finally {
    console.log("eliminar finalizado");
  }
};

// Componentes Vue
Vue.component("menu-component", {
  template: "#menu-template",
  data() {
    return {
      productos: [],
      mensaje: "",
      mensajeError: false,
    };
  },
  created() {
    this.cargarProductos();
    // Temporizador: Refrescar cada 5 segundos
    this.intervalId = setInterval(() => {
      this.cargarProductos();
    }, 5000);
  },
  beforeDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  },
  methods: {
    cargarProductos() {
      cargarLista()
        .then((data) => {
          // Inicializar cantidadInput y precioInput para cada producto
          this.productos = data.map((producto) => ({
            ...producto,
            cantidadInput: producto.cantidad,
            precioInput: producto.precio,
          }));
          if (data.length === 0) {
            this.mensaje = "No hay productos para mostrar";
            this.mensajeError = true;
          } else {
            this.mensaje = "";
            this.mensajeError = false;
          }
        })
        .catch((error) => {
          console.error("Error al cargar productos:", error);
          this.mensaje = "Error al cargar productos";
          this.mensajeError = true;
        });
    },
    async incrementarCantidad(nombre, calidad) {
      try {
        const producto = this.productos.find(
          (item) => item.nombre === nombre && item.calidad === calidad
        );
        if (!producto) {
          this.mensaje = "Error: Producto no encontrado";
          this.mensajeError = true;
          return;
        }
        producto.cantidad += 1;
        producto.cantidadInput = producto.cantidad; // Sincronizar input
        await guardarLista(this.productos);
        Toastify({
          text: `Cantidad de ${nombre} incrementada`,
          duration: 3000,
          gravity: "bottom",
          position: "right",
          style: {
            background: "#4caf50",
            color: "#fff",
          },
        }).showToast();
        this.mensaje = "";
        this.mensajeError = false;
      } catch (error) {
        console.error("Error en incrementarCantidad (try-catch):", error);
        this.mensaje = "Error al incrementar cantidad";
        this.mensajeError = true;
      } finally {
        console.log("incrementarCantidad finalizado");
      }
    },
    async decrementarCantidad(nombre, calidad) {
      try {
        const producto = this.productos.find(
          (item) => item.nombre === nombre && item.calidad === calidad
        );
        if (!producto) {
          this.mensaje = "Error: Producto no encontrado";
          this.mensajeError = true;
          return;
        }
        if (producto.cantidad <= 0) {
          this.mensaje = "Error: La cantidad no puede ser negativa";
          this.mensajeError = true;
          return;
        }
        producto.cantidad -= 1;
        producto.cantidadInput = producto.cantidad; // Sincronizar input
        await guardarLista(this.productos);
        Toastify({
          text: `Cantidad de ${nombre} decrementada`,
          duration: 3000,
          gravity: "bottom",
          position: "right",
          style: {
            background: "#4caf50",
            color: "#fff",
          },
        }).showToast();
        this.mensaje = "";
        this.mensajeError = false;
      } catch (error) {
        console.error("Error en decrementarCantidad (try-catch):", error);
        this.mensaje = "Error al decrementar cantidad";
        this.mensajeError = true;
      } finally {
        console.log("decrementarCantidad finalizado");
      }
    },
    async confirmarCambios(nombre, calidad) {
      try {
        const producto = this.productos.find(
          (item) => item.nombre === nombre && item.calidad === calidad
        );
        if (!producto) {
          this.mensaje = "Error: Producto no encontrado";
          this.mensajeError = true;
          return;
        }
        const nuevoPrecio = producto.precioInput;
        const nuevaCantidad = producto.cantidadInput;
        if (isNaN(nuevoPrecio) || nuevoPrecio < 0) {
          this.mensaje = "Error: El precio debe ser un número no negativo";
          this.mensajeError = true;
          producto.precioInput = producto.precio; // Restaurar valor
          return;
        }
        if (!Number.isInteger(nuevaCantidad) || nuevaCantidad < 0) {
          this.mensaje =
            "Error: La cantidad debe ser un número entero no negativo";
          this.mensajeError = true;
          producto.cantidadInput = producto.cantidad; // Restaurar valor
          return;
        }
        producto.precio = nuevoPrecio;
        producto.cantidad = nuevaCantidad;
        producto.precioInput = nuevoPrecio; // Sincronizar input
        producto.cantidadInput = nuevaCantidad; // Sincronizar input
        await guardarLista(this.productos);
        Toastify({
          text: `Precio y cantidad de ${nombre} actualizados`,
          duration: 3000,
          gravity: "bottom",
          position: "right",
          style: {
            background: "#4caf50",
            color: "#fff",
          },
        }).showToast();
        this.mensaje = "";
        this.mensajeError = false;
      } catch (error) {
        console.error("Error en confirmarCambios (try-catch):", error);
        this.mensaje = "Error al actualizar precio y cantidad";
        this.mensajeError = true;
        const producto = this.productos.find(
          (item) => item.nombre === nombre && item.calidad === calidad
        );
        if (producto) {
          producto.precioInput = producto.precio; // Restaurar valor
          producto.cantidadInput = producto.cantidad; // Restaurar valor
        }
      } finally {
        console.log("confirmarCambios finalizado");
      }
    },
    async eliminarProducto(nombre, calidad) {
      try {
        const result = await Swal.fire({
          title: "¿Estás seguro?",
          text: `¿Quieres eliminar el producto "${nombre}" con calidad ${calidad}?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sí, eliminar",
          cancelButtonText: "Cancelar",
        });
        if (!result.isConfirmed) return;

        const obj = new Producto(nombre, 0, 0, calidad);
        if (!obj.nombre || isNaN(obj.calidad)) {
          this.mensaje = "Error: Datos inválidos para eliminar";
          this.mensajeError = true;
          return;
        }
        const originalLength = this.productos.length;
        this.productos = eliminar.call(obj, this.productos);
        if (this.productos.length < originalLength) {
          Toastify({
            text: "Producto eliminado correctamente",
            duration: 3000,
            gravity: "bottom",
            position: "right",
            style: {
              background: "#4caf50",
              color: "#fff",
            },
          }).showToast();
          this.mensaje = "";
          this.mensajeError = false;
        } else {
          this.mensaje = "El producto no existe";
          this.mensajeError = true;
        }
      } catch (error) {
        console.error("Error en eliminarProducto (try-catch):", error);
        this.mensaje = "Error al eliminar producto";
        this.mensajeError = true;
      } finally {
        console.log("eliminarProducto finalizado");
      }
    },
  },
});

Vue.component("agregar-component", {
  template: "#agregar-template",
  data() {
    return {
      nuevoProducto: {
        nombre: "",
        precio: 0,
        cantidad: 0,
        calidad: 0,
      },
      mensaje: "",
      mensajeError: false,
    };
  },
  methods: {
    handleAgregar() {
      try {
        const { error, obj } = nuevo_objeto(
          this.nuevoProducto.nombre.trim(),
          this.nuevoProducto.precio,
          this.nuevoProducto.cantidad,
          this.nuevoProducto.calidad
        );
        if (error || !obj) {
          this.mensaje = error;
          this.mensajeError = true;
          return;
        }
        this.$root.productos = agregar.call(obj, this.$root.productos);
        Toastify({
          text: "Producto agregado correctamente",
          duration: 3000,
          gravity: "bottom",
          position: "right",
          style: {
            background: "#4caf50",
            color: "#fff",
          },
        }).showToast();
        this.mensaje = "";
        this.mensajeError = false;
        this.nuevoProducto = { nombre: "", precio: 0, cantidad: 0, calidad: 0 };
        setTimeout(() => {
          this.$router.push("/menu");
        }, 1000);
      } catch (error) {
        console.error("Error en handleAgregar (try-catch):", error);
        this.mensaje = "Error al agregar producto";
        this.mensajeError = true;
      } finally {
        console.log("handleAgregar finalizado");
      }
    },
  },
});

// Configuración de Vue Router
const routes = [
  { path: "/menu", component: Vue.component("menu-component") },
  { path: "/agregar", component: Vue.component("agregar-component") },
  { path: "/", redirect: "/menu" },
];

const router = new VueRouter({
  routes,
});

// Instancia principal de Vue
new Vue({
  el: "#app",
  router,
  data: {
    productos: [],
  },
  created() {
    cargarLista()
      .then((data) => {
        this.productos = data;
      })
      .catch((error) => {
        console.error("Error al cargar lista inicial:", error);
      });
  },
});
