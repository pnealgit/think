var Team = function(color,num_rovers,num_inputs,num_hidden,num_outputs) {
    this.color = color;
    this.num_rovers = num_rovers;
    this.num_inputs = num_inputs;
    this.num_hidden = num_hidden;
    this.num_outputs = num_outputs;
    this.genomes = [];
    this.brains = [];
    this.rovers = [];
    //return this;
} //end of function


function reset_rover_positions(team) {
   for(var nn=0; nn <num_rovers;nn++) {
         team.rovers[nn].reset_position();
   } //end of loop
}

function update_rovers(team) {
   for(var i=0; i <team.num_rovers;i++) {
       team.rovers[i].state = team.rovers[i].get_sensor_data();
       team.rovers[i].angle = team.brains[i].think(team.rovers[i].state);
       team.rovers[i].move();
       team.genomes[i].reward = team.rovers[i].get_reward(team.rovers);
       team.rovers[i].draw(team.color);
   }
}
 
function Rover(id) {
    this.id = id;
    lox = Math.floor(30);
    hix = Math.floor(width-30);
    this.x = getRandomInt(lox,hix);

    loy = Math.floor(30);
    hiy = Math.floor(height-30);
    this.y = getRandomInt(loy,hiy);
    this.r = 15;
    this.num_sensors = 3;
    this.velocity = 4.0;
    this.sensor_length = this.r+15
    this.delta_radians = (2.0*Math.PI)*(1.0/12.0)
    this.epxs = [];
    this.epys = [];
    this.state = [];
    this.sensor_data = [];
    this.reward = 0.0;
    this.angle = Math.random() * 2.0 * Math.PI;
    this.dx = this.velocity * Math.cos(this.angle);
    this.dy = this.velocity * Math.sin(this.angle);

    this.move = function() {
        this.dx = this.velocity * Math.cos(this.angle)
        this.dy = this.velocity * Math.sin(this.angle)
        this.x += this.dx;
        this.y += this.dy;
    }

    this.draw = function(color) {
        ctx = myGameArea.context;
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.r,0,2*Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = '#003300';
        for (s=0;s< this.num_sensors;s++) {
          shift = s-1;
          tangle = this.angle + (shift*this.delta_radians);
          y2 = this.sensor_length*Math.sin(tangle)
          x2 = this.sensor_length*Math.cos(tangle)
          ctx.moveTo(this.x,this.y)
          this.epxs[s]  = this.x + x2
          this.epys[s]  = this.y + y2
          ctx.lineTo(this.epxs[s],this.epys[s])
        } //end of loop on sensors

        ctx.stroke();
        ctx.closePath();
     } //end of rover draw 

} //end of Rover function  

function make_rovers(team) {
    rovers = [];
    for(var ri = 0;ri<num_rovers;ri++) {
        team.rovers[ri] = new Rover(ri);
    }
}//end of function make_rovers

      
Rover.prototype.get_sensor_data= function() {
      this.state = [0,0,0,0,0,0,0,0,0];
      //food
      for (s=0;s<this.num_sensors;s++) {
           this.state[s] = 0
           for (i = 0;i<num_foods;i++) {
             f = foods[i];
             dist = Math.hypot((f.x-this.epxs[s]),(f.y-this.epys[s]));
             test = f.r ;
             if (dist <= test) {
              this.state[s] = 1
             } //end of if
           } //end of loop on food

         //now for borders
         this.state[3+s] = 0;
         if (this.epxs[s] > myGameArea.canvas.width-2 || this.epxs[s] < 5) {
            this.state[3+s] = 1;
         }
         if (this.epys[s] > myGameArea.canvas.height-2 || this.epys[s] < 5) {
            this.state[3+s] = 1;
         }
         //other rovers !!!
           for (ix = 0;ix<this.num_rovers;ix++) {
             if (ix != this.id) {
               rvr = team.rovers[ix];
               dist = Math.hypot((rvr.x-this.epxs[s]),(rvr.y-this.epys[s]));
               test = rvr.r ;
               if (dist <= test) {
                  this.state[6+s] = 1;
               } //end of if on dist test
            } //end of if on not me
           } //end of loop on rovers

        } //end of loop on sensors
      return this.state;
    } //end of get_sensor_data function

Rover.prototype.get_reward = function(rvrs) {
        //food
        no_change = true;
        new_reward = 0;
        for (ij = 0;ij<num_foods;ij++) {
           dist = Math.hypot((foods[ij].x-this.x),(foods[ij].y-this.y));
           test = foods[ij].r + this.r;
           //console.log('dist,test',dist,test);
           if (dist <= test) {
                new_reward += 4;
                no_change = false;
                //if (foods[ij].r >= 8) {
                   //foods[ij].r--;
                //}
           } //end of if
         } //end of loop on food

       //now for borders
       if (this.x > myGameArea.canvas.width-5 || this.x < 5) {
         if( this.velocity > 0.0) {
           this.reward += -1;
           no_change = false;
           this.velocity = 0.0;
         }
       }
       if (this.y > myGameArea.canvas.height-2 || this.y < 5) {
         if (this.velocity > 0.0) {
           new_reward+= -1;
           no_change = false;
           this.velocity = 0.0;
         }
       } //end of if

      for (ir = 0;ir<num_rovers;ir++) {
         if (ir != this.id) {
           dist = Math.hypot((rvrs[ir].x-this.x),(rvrs[ir].y-this.y));
           test = rvrs[ir].r + this.r;
           if (dist <= test) {
                new_reward += -1;
                no_change = false;
           } //end of if on dist test
          } //end of if on not me
       } //end of loop on rovers

       if (no_change === true ) {
           new_reward = -1;
       }
       return new_reward;
} //end of get_reward

     
Rover.prototype.reset_position = function() {
        lox = Math.floor(30);
        hix = Math.floor(width-30);
        this.x = getRandomInt(lox,hix);
        loy = Math.floor(30);
        hiy = Math.floor(height-30);
        this.y = getRandomInt(loy,hiy);
        this.angle = Math.random() * 2.0 * Math.PI;
        this.velocity = 1.0;
    }

