# TicTacToeHomeWork
For homework at ringier


I used socket.IO events for communication between client and server. I open connections on the client to connect to the server. Once connected to the server, we will have a two way pipeline through which both client and server can send data to each other. The main advantage of this is that the server can send data to the client without the client even requesting it! This is particularly helpful for scenarios where we need to push data to the client based on some events.

I’ll be creating my own events to help build my game. Here is a brief overview of how my game will work. One player will create the game (Player 1 or X) and will provide the other player with a game Id. The second player will join the game (Player 2 or O). This game will exist till we have a winner or the game is tied.
