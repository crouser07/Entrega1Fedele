// menu de programa se divide en:
// salir, agregar item, eliminar y mostrar lista de items
let Option = 9;
let lista = [];
while (Option !== 0) {
  Option = Number(
    prompt(
      "Eliga la Opcion:\n 1.Agregar item\n 2.Eliminar item\n 3.Mostrar Lista\n 0.Salir"
    )
  );
  switch (Option) {
    case 0:
      console.log("fin");
      break;
    case 1:
      let item = new_item();
      agregar(item, lista);
      break;
    case 2:
      lista = eliminar(lista);
      break;
    case 3:
      mostrar(lista);
      break;
    default:
      console.error("La opcion ingresada no es valida intente devuelta!!!");
      break;
  }
}
