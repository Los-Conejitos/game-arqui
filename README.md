#Arquitectura de software 2015-1

## World Shock

Repositorio de la plataforma colaborativa "World Shock"

## Funcionalidades

- Authenticacion con facebook
- Juego en tiempo real
- Soporte de varios usuarios ( al menos 2 usuarios )

## Pasos para instalar librerias
1. Ubicarse en la carpeta raiz del proyecto y ejecutar cada comando desde la terminal.
2. Tener instalado Express.js (sudo npm install expressjs)
3. Tener instalado Async.js (sudo npm install async)
4. Tener instalado Socket.io (sudo npm install socket.io)

## Pasos para correr el juego

### Windows
1. Instalar **nodejs** 
2. Instalar **npm**
3. Instalar las librerias anteriores con npm
4. Correr la aplicacion: `$ node server.js`
5. En el browser ingresar: [http://localhost:3000/] (http://localhost:3000/login)

### Linux

1. Instalar nodejs
	
		sudo apt-get install nodejs

2. Instalar npm
	
		sudo apt-get install npm


3. Instalar express
	
		sudo npm install express


4. Instalar async
	
		sudo npm install async


5. Instalar socket.io
	
		sudo npm install socket.io


6. Dirigirse a la raiz del proyecto

7. Ejecutar el servidor
	
		node server.js
	
8. En el browser ingresar: [http://localhost:3000/] (http://localhost:3000/login)

## Documentacion de desarrollo
 https://docs.google.com/document/d/1Yn2OlEaAA436YV5oNoz4RtOBoatZ-DtRyPE-ouzX7xE
 
## NOTA:
	Actualmente existen las siguientes ramas:
		- master 
		- logeo ( el login se encuentra en el back-end)
