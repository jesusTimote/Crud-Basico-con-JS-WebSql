/*------ ----- Conneccion a BD ----- ------*/
let db = openDatabase("myDB", "1.0", "my first database", 2 * 1024 * 1024);
if (!db) {
  alert("OOPS! LA BASE DE DATOS NO ESTA CREADA");
} else {
  let version = db.version;
  console.log(version);
}
/*------ ----- Creacion de la tabla  ----- ------*/
db.transaction((con) => {
  con.executeSql(
    "CREATE TABLE IF NOT EXISTS USER (" +
    "id INTEGER NOT NULL PRIMARY KEY ," +
    "nombre TEXT NOT NULL, apellido TEXT NOT NULL,edad INTEGER NOT NULL);"
  );
});

const $Form = document.getElementById("form");
const $Enviar = document.getElementById("Enviar");
const btnActualiza=document.getElementById("Actualiza");

/*------ ----- Metodo de Guardar ----- ------*/
const Guardar = () => {
  let id = document.getElementById("codigo").value;
  let nombre = document.getElementById("nombre").value;
  let apellido = document.getElementById("apellido").value;
  let edad = document.getElementById("edad").value;

  if (id == "" || nombre == "" || apellido == "" || edad == "") {
    alert("Rellenar todos los campos")
  } else if (Math.sign(edad) === -1) {
    alert("No ingreses n° negativos");
  } else {

    db.transaction((con) => {
      con.executeSql(
        "insert into USER (ID,NOMBRE,APELLIDO,EDAD) values (?,?,?,?)",
        [id, nombre, apellido, edad]
      );
    
    });
  }
  Listado();

};


/*------ ----- Metodo de Listado ----- ------*/
/*const Listado = () => {
  let $table = document.getElementById("Listar");
  db.transaction((con) => {
    con.executeSql('SELECT * FROM USER', [], (con, result) => {
      let rows = result.rows;
      let tr = '';
      for (let i = 0; i < rows.length; i++) {
        tr += '<tr>';
        tr += '<td>' + rows[i].id + '</td>';
        tr += '<td>' + rows[i].nombre + '</td>';
        tr += '<td>' + rows[i].apellido + '</td>';
        tr += '<td>' + rows[i].edad + '</td>';
        tr += '</tr>';
      }
      $table.innerHTML = tr;
      console.log(tr);
    })
  })
}*/

const Listado = () => {
  let $table = document.getElementById("Listar");
  $table.innerHTML="";
  db.transaction((con) => {
    con.executeSql("SELECT * FROM USER", [], (con, result) => {
      for (let i = 0; i < result.rows.length; i++) {
        $table.innerHTML += `
        <tr>
            <td>${result.rows[i].id}</td>
            <td>${result.rows[i].nombre}</td>
            <td>${result.rows[i].apellido}</td>
            <td>${result.rows[i].edad}</td>
            <td><buttom onclick=Editar('${result.rows[i].id}') type='button' class='btn btn-success'><i class='fas fa-edit'></i></buttom> | <buttom type='button' onclick=Eliminar('${result.rows[i].id}')  class='btn btn-danger'><i class=' fas fa-trash-alt'></i></buttom></td>
        </tr>
        
        `;

      }
    });
  });
};
document.addEventListener("DOMContentLoaded", Listado);


const Eliminar = (codigo) => {

  db.transaction((con) => {
    con.executeSql(
      "DELETE FROM USER WHERE id=?", [codigo]);

  });
  Listado();
}

const Editar = (codigo) => {
  let id = document.getElementById("codigo");
  let nombre = document.getElementById("nombre");
  let apellido = document.getElementById("apellido");
  let edad = document.getElementById("edad");
  
  id.value = codigo

  db.transaction((con) => {
    con.executeSql(
      "SELECT * FROM USER WHERE id=?", [codigo], (con, result) => {
        let rows = result.rows[0]

        id.value = rows.id;
        nombre.value = rows.nombre;
        apellido.value = rows.apellido;
        edad.value = rows.edad;
      });
  });
  btnActualiza.style.visibility = "visible";
  $Enviar.style.visibility="hidden";
}

const Modifica = () => {
  
  let id = document.getElementById("codigo").value;
  let nombre = document.getElementById("nombre").value;
  let apellido = document.getElementById("apellido").value;
  let edad = document.getElementById("edad").value;
  console.log(id);
  db.transaction((con) => {
    if(id){
      con.executeSql(
        "UPDATE USER SET NOMBRE=?,APELLIDO=?,EDAD=? WHERE ID=?",
        [nombre, apellido, edad, id]
      
      );

    }
    
  });
  Listado();
  btnActualiza.style.visibility = "hidden";
  $Enviar.style.visibility="visible";
  $Form.reset();
}
const Actualiza = (document.getElementById("Actualiza").onclick = Modifica);


/*------ ----- Evento  de boton guardar ----- ------*/
$Form.addEventListener("submit", (e) => {
  Guardar();
  $Form.reset();
  e.preventDefault();
});
