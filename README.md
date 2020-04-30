# CRUD LIBROS / JWT

<p align="center">
  <img src="https://i.gyazo.com/e54b63e0e5c0b64edf3b5c5f3d61c6a5.png"/>
</p>


### Instalar dependencias

```
npm install
```

### Ejecutar la API.

```
npm run start:dev
```

:D

## Funcionamiento de Registro con JWT

## Register
Usamos query variables para pasar el cuerpo del **UserInput** y mostramos la query a nuestro gusto segun los campos que se requieran ver.

[![Image from Gyazo](https://i.gyazo.com/19d53fa0b5fe5f0009c7d50603358daf.png)](https://gyazo.com/19d53fa0b5fe5f0009c7d50603358daf)


## Login

Utilizamos nuestra query para inicio de sesión, pasando correo y password anteriormente registrado. **En caso de no existir el correo o tener erronea la password retorna un error de status**

[![Image from Gyazo](https://i.gyazo.com/20356faf41b026dc9dbaee2ac6e09dc1.png)](https://gyazo.com/20356faf41b026dc9dbaee2ac6e09dc1)

## Validación

Utilizamos la query para retornar la validación de que el usuario exista de acuerdo al token de inicio de sesión, el token se pasa por los http headers mediante [Authorization](https://www.prisma.io/tutorials/authentication-in-apollo-server-ct21).



[![Image from Gyazo](https://i.gyazo.com/d2c58c336647cf4b7041c2f72286c4c4.png)](https://gyazo.com/d2c58c336647cf4b7041c2f72286c4c4)


:grin: