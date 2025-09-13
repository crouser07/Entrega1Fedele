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
    if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
      return { error: "EL NOMBRE NO PUEDE ESTAR VACIO", obj: null };
    }
    if (isNaN(precio) || precio < 0) {
      return { error: "EL PRECIO DEBE SER UN NÚMERO NO NEGATIVO", obj: null };
    }
    if (isNaN(cantidad) || !Number.isInteger(cantidad) || cantidad < 0) {
      return {
        error: "LA CANTIDAD DEBE SER UN NÚMERO ENTERO NO NEGATIVO",
        obj: null,
      };
    }
    if (isNaN(calidad) || !Number.isInteger(calidad) || calidad < 0) {
      return {
        error: "LA CALIDAD DEBE SER UN NÚMERO ENTERO NO NEGATIVO",
        obj: null,
      };
    }
    return {
      error: null,
      obj: new Producto(
        nombre.trim(),
        parseFloat(precio.toFixed(2)),
        parseInt(cantidad),
        parseInt(calidad)
      ),
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
                  typeof item.nombre !== "string" ||
                  isNaN(item.precio) ||
                  item.precio < 0 ||
                  isNaN(item.cantidad) ||
                  item.cantidad < 0 ||
                  isNaN(item.calidad) ||
                  item.calidad < 0 ||
                  !Number.isInteger(item.cantidad) ||
                  !Number.isInteger(item.calidad)
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
        (item) =>
          item.nombre.toLowerCase() === this.nombre.toLowerCase() &&
          item.calidad === this.calidad
      )
    ) {
      return lista; // No agrega si ya existe
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
      (item) =>
        !(
          item.nombre.toLowerCase() === this.nombre.toLowerCase() &&
          item.calidad === this.calidad
        )
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
          this.productos = data;
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
    async modificarProducto(nombre, calidad, precioActual, cantidadActual) {
      try {
        const { value: formValues } = await Swal.fire({
          title: `Modificar ${nombre} (Calidad ${calidad}°)`,
          html:
            "<label>Precio ($):</label>" +
            '<input id="swal-input-precio" type="number" class="swal2-input" min="0" step="0.01" value="' +
            precioActual +
            '">' +
            "<label>Cantidad:</label>" +
            '<input id="swal-input-cantidad" type="number" class="swal2-input" min="0" step="1" value="' +
            cantidadActual +
            '">',
          focusConfirm: false,
          showCancelButton: true,
          confirmButtonText: "Confirmar",
          cancelButtonText: "Cancelar",
          preConfirm: () => {
            return {
              precio: parseFloat(
                document.getElementById("swal-input-precio").value
              ),
              cantidad: parseInt(
                document.getElementById("swal-input-cantidad").value
              ),
            };
          },
        });

        if (formValues) {
          const { precio, cantidad } = formValues;
          const producto = this.productos.find(
            (item) =>
              item.nombre.toLowerCase() === nombre.toLowerCase() &&
              item.calidad === calidad
          );
          if (!producto) {
            this.mensaje = "Error: Producto no encontrado";
            this.mensajeError = true;
            return;
          }
          if (isNaN(precio) || precio < 0) {
            this.mensaje = "Error: El precio debe ser un número no negativo";
            this.mensajeError = true;
            return;
          }
          if (isNaN(cantidad) || !Number.isInteger(cantidad) || cantidad < 0) {
            this.mensaje =
              "Error: La cantidad debe ser un número entero no negativo";
            this.mensajeError = true;
            return;
          }
          let cambiosRealizados = false;
          let mensajeToast = [];
          if (precio !== producto.precio) {
            producto.precio = precio;
            cambiosRealizados = true;
            mensajeToast.push(`Precio actualizado a $${precio.toFixed(2)}`);
          }
          if (cantidad !== producto.cantidad) {
            producto.cantidad = cantidad;
            cambiosRealizados = true;
            mensajeToast.push(`Cantidad actualizada a ${cantidad}`);
          }
          if (!cambiosRealizados) {
            this.mensaje = "No se realizaron cambios";
            this.mensajeError = true;
            return;
          }
          await guardarLista(this.productos);
          Toastify({
            text: `Cambios en ${nombre}: ${mensajeToast.join(", ")}`,
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
        }
      } catch (error) {
        console.error("Error en modificarProducto (try-catch):", error);
        this.mensaje = "Error al modificar producto";
        this.mensajeError = true;
      } finally {
        console.log("modificarProducto finalizado");
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
    generarPDF() {
      try {
        if (this.productos.length === 0) {
          this.mensaje = "No hay productos para incluir en el PDF";
          this.mensajeError = true;
          return;
        }

        // Usar jsPDF para generar el PDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Título
        doc.setFontSize(16);
        doc.text("Lista de Productos", 10, 10);

        // Encabezados de la tabla
        doc.setFontSize(12);
        doc.text("Item", 10, 20);
        doc.text("Precio ($)", 50, 20);
        doc.text("Cantidad", 80, 20);
        doc.text("Calidad (°)", 110, 20);
        doc.text("Precio Total ($)", 140, 20);

        // Línea horizontal debajo de los encabezados
        doc.line(10, 22, 190, 22);

        // Filas de productos
        let y = 30;
        this.productos.forEach((producto) => {
          const precioTotal = (producto.precio * producto.cantidad).toFixed(2);
          doc.text(producto.nombre, 10, y);
          doc.text(`$${producto.precio.toFixed(2)}`, 50, y);
          doc.text(`${producto.cantidad}`, 80, y);
          doc.text(`${producto.calidad}°`, 110, y);
          doc.text(`$${precioTotal}`, 140, y);
          y += 10;
        });

        // Guardar el PDF
        doc.save("inventario.pdf");

        Toastify({
          text: "PDF generado correctamente",
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
        console.error("Error en generarPDF (try-catch):", error);
        this.mensaje = "Error al generar el PDF";
        this.mensajeError = true;
      } finally {
        console.log("generarPDF finalizado");
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
    async handleAgregar() {
      try {
        // Normalizar y validar datos de entrada
        const nombre = this.nuevoProducto.nombre.trim();
        const precio = parseFloat(this.nuevoProducto.precio);
        const cantidad = parseInt(this.nuevoProducto.cantidad);
        const calidad = parseInt(this.nuevoProducto.calidad);

        // Verificar si ya existe un producto con el mismo nombre y calidad
        const existeProducto = this.$root.productos.some(
          (item) =>
            item.nombre.toLowerCase() === nombre.toLowerCase() &&
            item.calidad === calidad
        );
        if (existeProducto) {
          await Swal.fire({
            title: "Error",
            text: `Ya existe un producto con el nombre "${nombre}" y calidad ${calidad}°.`,
            icon: "error",
            confirmButtonText: "Aceptar",
          });
          this.mensaje = "";
          this.mensajeError = false;
          return;
        }

        // Validar datos con nuevo_objeto
        const { error, obj } = nuevo_objeto(nombre, precio, cantidad, calidad);
        if (error || !obj) {
          await Swal.fire({
            title: "Error",
            text: error,
            icon: "error",
            confirmButtonText: "Aceptar",
          });
          this.mensaje = "";
          this.mensajeError = false;
          return;
        }

        // Agregar producto
        this.$root.productos = agregar.call(obj, this.$root.productos);

        // Mostrar notificación de éxito
        Toastify({
          text: `Producto "${nombre}" agregado correctamente`,
          duration: 3000,
          gravity: "bottom",
          position: "right",
          style: {
            background: "#4caf50",
            color: "#fff",
          },
        }).showToast();

        // Limpiar formulario
        this.nuevoProducto = { nombre: "", precio: 0, cantidad: 0, calidad: 0 };
        this.mensaje = "";
        this.mensajeError = false;

        // Redirigir a /menu tras 1 segundo
        setTimeout(() => {
          this.$router.push("/menu");
        }, 1000);
      } catch (error) {
        console.error("Error en handleAgregar (try-catch):", error);
        await Swal.fire({
          title: "Error",
          text: "Error inesperado al agregar el producto",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
        this.mensaje = "";
        this.mensajeError = false;
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
