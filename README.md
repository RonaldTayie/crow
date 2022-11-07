# crow

# Repo
This repo contains the UI /fron end of the Crow GPS tracking and logging system.

## Acknowledgements
The Layout for this application was inspired by [Thabelani Moyo](github.com/bloodyeclipse)

# Project Description

The entire project is devided in to two main parts, namely, the API/backend and the UI/ Front end.
The Front end is built using VueJS while the back end is built using Django.
Due to security updates in progress (as of Oct 27, 2022), access to the API Repo will be restricted.

The two components communicate using the HTTP methods GET, PUT, POST and Delete.
The design and implementation of requests and the design of the API was inspired by CRUD functionality. During development, it meant that procedures/tasks could be seperated efectively treating most of the core components of the application as indiviual parts.

# Tracking

The tracking functionality is achieved using web socket connections between the Backend and the front end. When a user logs in, their HTTPS connection is upgraded to a websocket connection. This is done in such a manner that the websocket connection remains alive while the user interacts with other parts of the application. As the use interacts with other parts of the application, requests to the API are sent using normal HTTPS,outside and away from the websocket connection. This help ensure that the UI would be and will continue to be easy to update to complimet the changes to the API.


### Live Link
```
https://crow-731b5.web.app/
```
