# Tolomeo-Aberturas
Pagina de aberturas puertas, ventanas, portones Avenida Juan B. Justo MDP

## Reglas de acceso de Firestore

El catálogo y la configuración del sitio se pueden leer públicamente. Solo la
cuenta administradora configurada en `Admin.html` y `firestore.rules` puede
crear, editar o eliminar esos datos. Los demás accesos a Firestore se deniegan;
las ranuras de personajes solo son accesibles por la cuenta propietaria.

Para aplicar las reglas al proyecto Firebase, iniciá sesión con Firebase CLI y
desplegalas explícitamente:

```sh
firebase deploy --only firestore:rules --project tolomeopuertasyventnas
```

La lista de administradores en `Admin.html` y el email de `isAdmin()` en
`firestore.rules` deben mantenerse sincronizados. Cambiar solo el código del
sitio no actualiza las reglas publicadas en Firebase.

## Entrenar al Yeti

Desde el panel `Admin.html`, ingresá con la cuenta administradora y elegí
**Entrenar a Yeti**. Cada regla permite asociar hasta 10 palabras o frases
separadas por comas con una respuesta de hasta 500 caracteres. Agregá, editá o
quitá reglas y luego seleccioná **Guardar entrenamiento** para publicarlas.

Las reglas guardadas se leen públicamente para que el chat las use; solo la
cuenta administradora puede modificarlas, de acuerdo con las reglas de
`siteConfig`. Se prueban antes que las respuestas preprogramadas del Yeti. El
chat sigue siendo automático y basado en coincidencias, no usa inteligencia
artificial ni envía los mensajes de los visitantes.

## Minijuegos del Yeti

En el menú de la mascota, **Jugar** abre una ventana independiente con 11
minijuegos de movimiento, deportes, carreras y lógica. Se cierra con el botón
**Cerrar** o Escape; el catálogo conserva su estado. Los juegos se ejecutan en
el navegador, no usan sensores de movimiento ni transmiten datos.
