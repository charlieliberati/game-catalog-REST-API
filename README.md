# Game Catalog-API

## Endpoints

### GET /games
Endpoint responsible for returning the list of all games in the catalog.
#### Parameters
None
#### Responses
##### OK, statuscode 200
If this response occurs, a list of all registered games will be returned in .json format.   

Response example:   
```
[
    {
        "id": 2,
        "title": "Terraria",
        "year": "2012",
        "price": "60",
        "createdAt": "2023-09-19T21:20:21.000Z",
        "updatedAt": "2023-09-19T21:20:21.000Z"
    },
    {
        "id": 8,
        "title": "Warcraft",
        "year": "2022",
        "price": "70",
        "createdAt": "2023-09-20T02:50:15.000Z",
        "updatedAt": "2023-09-20T02:50:15.000Z"
    },
    {
        "id": 9,
        "title": "Super Mario Odissey",
        "year": "2023",
        "price": "250",
        "createdAt": "2023-09-20T03:15:44.000Z",
        "updatedAt": "2023-09-20T03:15:44.000Z"
    }
]
```
##### Authentication failed, statuscode 401
If this response occurs, some error occurred during the authentication of the request.
Reasons: invalid token, expired token or token not yet generated.  

Response example:  
```
{
    "err": "invalid token"
}
```

### GET /game/:id
Endpoint responsible for returning the game identified by id in the catalog.
#### Parameters
id: game id must be a number.
#### Responses
##### Game info, statuscode 200
If this response occurs, a game register identified by the id will be returned in .json format and a list of useful links.   

Response example:   
```
{
    "game": {
        "id": 2,
        "title": "Terraria",
        "year": "2012",
        "price": "60",
        "createdAt": "2023-09-19T21:20:21.000Z",
        "updatedAt": "2023-09-19T21:20:21.000Z"
    },
    "_links": [
        {
            "href": "http://localhost:8080/games",
            "method": "GET",
            "rel": "Geta all games"
        },
        {
            "href": "http://localhost:8080/game/2",
            "method": "DELETE",
            "rel": "Delete this game"
        },
        {
            "href": "http://localhost:8080/game/2",
            "method": "PUT",
            "rel": "Update game"
        },
        {
            "href": "http://localhost:8080/auth",
            "method": "POST",
            "rel": "Login and athentication"
        }
    ]
}
```
##### Authentication failed, statuscode 401
If this response occurs, some error occurred during the authentication of the request.
Reasons: invalid token, expired token or token not yet generated.  

Response example:  
```
{
    "err": "invalid token"
}
```
##### Id not found, statuscode 404
If this response occurs, some error occurred during the authentication of the request.
Reasons: no register found under the sent id.  

Response example:  
```
{
    "err": "id not found"
}
```
##### Invalid id format, statuscode 400
If this response occurs, the id sent was not a number.
Reasons: wrong id format.  

Response example:  
```
{
    "err": "invalid id format"
}
```

### POST /game/:id
Endpoint responsible for registering new games in the catalog.
#### Parameters
Game title, year and price in json format on the request body.

Input example:
```
{
  "title": "Brawlhalla",
  "year": 2014,
  "price": 10
}
```
#### Responses
##### OK statuscode 200
If this response occurs, the game has been sucessfylly registered. The game register and useful links will be returned.  

Response example:   
```
{
    "game": {
        "id": 12,
        "title": "Brawlhalla",
        "year": "2014",
        "price": "10",
        "createdAt": "2023-10-03T20:59:23.000Z",
        "updatedAt": "2023-10-03T20:59:23.000Z"
    },
    "_links": [
        {
            "href": "http://localhost:8080/games",
            "method": "GET",
            "rel": "Geta all games"
        },
        {
            "href": "http://localhost:8080/game/12",
            "method": "DELETE",
            "rel": "Delete this game"
        },
        {
            "href": "http://localhost:8080/game/12",
            "method": "PUT",
            "rel": "Update game"
        },
        {
            "href": "http://localhost:8080/auth",
            "method": "POST",
            "rel": "Login and athentication"
        }
    ]
}
```
##### Registering failed (title already exists), statuscode 409
If this response occurs, the title sent is aready in use on the database.
Reasons: duplicated title.  

Response example:  
```
{
    "err": "registering failed, title already exists"
}
```

##### Authentication failed, statuscode 401
If this response occurs, some error occurred during the authentication of the request.
Reasons: invalid token, expired token or token not yet generated.  

Response example:  
```
{
    "err": "invalid token"
}
```

### DELETE /game/:id
Endpoint responsible for removing a game from the catalog.
#### Parameters
Game id.

#### Responses
##### OK statuscode 200
If this response occurs, the game has been sucessfylly removed. A sucess message and a list of useful links will be sent as response.   

Response example:   
```
{
    "message": "game sucessfully removed",
    "_links": [
        {
            "href": "http://localhost:8080/games",
            "method": "GET",
            "rel": "Geta all games"
        },
        {
            "href": "http://localhost:8080/auth",
            "method": "POST",
            "rel": "Login and athentication"
        }
    ]
}
```
##### Game not found, statuscode 404
If this response occurs, the id sent doesn't match any game registered on the database.
Reasons: invalid id.  

Response example:  
```
{
    "err": "game not found"
}
```

##### Bad request, statuscode 400
If this response occurs, the id sent is either null or not a number.
Reasons: invalid id.  

Response example:  
```
Bad Request
```

### PUT /game/:id
Endpoint responsible for update a game in the catalog.
#### Parameters
Game id on the URL; game title, year and price in json format on the request body (all itens in this json are optional).

Input example:
```
.../game/16
```
and
```
{
  "title": "Cyberpunk 2077: Phantom Liberty (expansion)",
  "year": 2023,
  "price": 99
}
```

#### Responses
##### OK statuscode 200
If this response occurs, the game has been sucessfylly updated. 

Response example:   
```
{
    "game": {
        "id": 16,
        "title": "Cyberpunk 2077: Phantom Liberty (expansion)",
        "year": "2023",
        "price": "99",
        "createdAt": "2023-10-03T21:07:16.000Z",
        "updatedAt": "2023-10-03T21:29:45.000Z"
    },
    "_links": [
        {
            "href": "http://localhost:8080/games",
            "method": "GET",
            "rel": "Geta all games"
        },
        {
            "href": "http://localhost:8080/game/16",
            "method": "DELETE",
            "rel": "Delete this game"
        },
        {
            "href": "http://localhost:8080/game/16",
            "method": "PUT",
            "rel": "Update game"
        },
        {
            "href": "http://localhost:8080/auth",
            "method": "POST",
            "rel": "Login and athentication"
        }
    ]
}
```
##### Game not found, statuscode 404
If this response occurs, the id sent doesn't match any game registered on the database.
Reasons: invalid id.  

Response example:  
```
{
    "err": "game not found"
}
```

##### Bad request, statuscode 400
If this response occurs, Something went wrong on updating or the id sent is either null or not a number.
Reasons: invalid id.  

Response example:  
```
Bad Request
```
----------------------------------------------------------------------------------------
### POST /signup
Endpoint responsible for registering new users in the database.
#### Parameters
User name, email and password in json format on the request body.

Input example:
```
{
  "name": "joel",
  "email": "joe@email.com",
  "password": "anything"
}
```
#### Responses
##### OK statuscode 200
If this response occurs, the user has been sucessfylly registered.   

Response example:   
```
OK
```
##### Registering failed (email already in use), statuscode 409
If this response occurs, the email sent is already in use.
Reasons: duplicated email.  

Response example:  
```
{
    "err": "email already in use"
}
```

##### Bad request, statuscode 400
If this response occurs, one or more parameter may be missing.
Reasons: missing data on the request.  

Response example:  
```
Bad request
```

### POST /auth
Endpoint responsible for login and athentication.
#### Parameters
email: user e-mail.
password: user password.

Input example:
```
{
  "email": "joe@email.com",
  "password": "anything"
}
```
#### Responses
##### OK, statuscode 200
If this response occurs, the user has been sucessfylly logged in and an JWT access token for protected endpoints has been returned.   

Response example:    
```
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJoZWNAbWFpbC5jb20iLCJpYXQiOjE2OTU3NDYyMjMsImV4cCI6MTY5NTc1MzQyM30.T-FUulQew5qrVZ9lTwhOOasFzdBhYEGT_Ybf3mh3KFs"
}
```
##### Authentication failed, statuscode 401
If this response occurs, some error occurred during the authentication of the request.
Reasons: invalid password or email.  

Response example:  
```
{
    "err": "wrong email or password"
}
```
##### Data missing, statuscode 404
If this response occurs, e-mail and/or password may be missing.
Reasons: missing password or email.  

Response example:  
```
{
    "err": "email or password missing"
}
```
##### Internal failure, statuscode 400
If this response occurs, somemething went wrong on token generation.
Reasons: internal failure.  

Response example:  
```
{
    "err": "internal failure"
}
```
