// aca pide todos los datos del producto
// y los retirna para guardarlos en un array
const new_item = () => {
  let nombre = prompt("Ingrese nombre del producto:");
  let precio = Number(prompt("Ingrese precio del producto:"));
  let cantidad = Number(prompt("Ingrese cantidad del producto:"));
  let calidad = Number(prompt("Ingrese la calidad del producto:"));
  return [nombre, precio, cantidad, calidad];
};
// Aca verificados que el dato
// no este repetido y los valores
// esten bien asignados para agregarlo
// a la lista principal.
const agregar = (it, list) => {
  if (isNaN(it[1]) || isNaN(it[2]) || isNaN(it[3])) {
    console.error("ERROR CON LOS DATOS INGRESADOS");
  } else if (list.length === 0) {
    list.push(it);
  } else {
    let bar = false;
    for (let i = 0; i < list.length; i++) {
      if (list[i][0] === it[0] && list[i][3] === it[3]) {
        console.warn("EL ITEM YA EXISTE");
        bar = true;
      }
    }
    if (bar === false) {
      list.push(it);
    }
  }
};
// se muestra en orden los datos
// ingresados y la cantidad de
// producto total y el capital total
const mostrar = (lis) => {
  let totalP = 0;
  let totalM = 0;
  for (let i = 0; i < lis.length; i++) {
    console.log(
      `Producto:${lis[i][0]} Precio:$${lis[i][1]} Cantidad:${lis[i][2]} Calidad:${lis[i][3]}°`
    );
    totalP += lis[i][3];
    totalM += lis[i][3] * lis[i][1];
  }
};
// pide ingresar el nombre del producto
// y la calidad y si existe y se ingreso
// correctamente lo elimina
const eliminar = (lis) => {
  let it = [prompt("Ingrese el nombre"), Number(prompt("Ingrese la calidad:"))];
  let ban = true;

  for (let i = 0; i < lis.length; i++) {
    if (lis[i][0] === it[0] && lis[i][3] === it[1]) {
      lis.splice(i, 1);
      ban = false;
      console.log("Se elimino correctamente");
    }
  }
  if (isNaN(it[1])) {
    console.error("ERROR EN EL INGRESO DE DATOS");
  } else if (ban === true && !isNaN(it[1])) {
    console.warn("El producto no existe");
  }
  return lis;
};
