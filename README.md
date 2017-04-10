# think
A genetic algorithm Neural Net project with a  web front end to a Golang (GO) backend. 
Open up your javascript console to get info.

I run it on Chrome.

Server.go is a simple go web server.
Use whatever web server you want.

Let it run for a few hours. Eventually the red things
won't go to the wall...At least not too much. And the 'SUM REWARDS'
in the console window should slowly increase

Essentially this is a genetic algorithm the supplies the
weights to a 3 layer neural net (input,hidden,output). 
The neural net is only feed-forward. No back propagation.
The output layer of the neural net hopefully gives a result from 0 to 1.
This is then multiplied by 2*PI to get a direction angle in radians
Everything is inside the browser. Next I will try to put the
GA and the NN in a separate process and communicate via websockets.
If it isn't too slow.
