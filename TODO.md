# Use case:
## Server:
* Server start
* Load all rooms and create namespace for each one
* Listen when user want to create a room
- Create room in database
- Create namespace
- Send room to user (1)
## Client:
* User login to the app
* Use the first room -> Connect user to the room namespace
* (1) Create a socket and store it in CoreService -> Go to room