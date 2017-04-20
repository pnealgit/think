function make_brains(team) {
   //brains = [];
   for(var i=0;i<team.num_rovers;i++) {
       brain = new Brain(i,team.num_inputs,team.num_hidden,team.num_outputs);
       g = team.genomes[i];
       ws = brain.make_weight_matrices(g);

       brain.input_to_hidden_weights = ws[0];
       brain.hidden_to_output_weights = ws[1];
       team.brains[i] = brain;
   } //end of loop
} //end of function
 
function Brain(i,num_inputs,num_hidden,num_outputs) {
    this.id = i;
    this.num_inputs = num_inputs;
    this.num_hidden = num_hidden;
    this.num_outputs = num_outputs;

    this.input_layer = [];
    this.hidden_layer = [];
    this.output_layer = [];
    this.input_to_hidden_weights = [];
    this.hidden_to_output_weights = [];


} //end of Brain


make_weight_matrix = function(g,k,from_length,to_length) {
        new_mat = [];
        for (i = 0;i<from_length;i++) {
           junk = [];
           for (j = 0;j<to_length;j++) {
              junk[j] = g.dna_string[k];
              k+= 1;
           } //end of loop on inputs
       new_mat[i] = junk;
       }//end of loop 
       return new_mat;
    } //end of function

function make_new_weights(team) {
   for(var ii = 0; ii < num_rovers;ii++) {
       g = team.genomes[ii];
//console.log('make new weidths g is ',g);

       ws = team.brains[ii].make_weight_matrices(g);
       team.brains[ii].input_to_hidden_weights = ws[0];
       team.brains[ii].hidden_to_output_weights = ws[1];
   }
} //end of function


Brain.prototype.make_weight_matrices = function(g) {
    k = 0; 
    input_to_hidden_weights = 
       make_weight_matrix(g,k,this.num_inputs,this.num_hidden);

    k = this.num_inputs*this.num_hidden;
    hidden_to_output_weights = 
       make_weight_matrix(g,k,this.num_hidden,this.num_outputs);
    return [input_to_hidden_weights,hidden_to_output_weights];
} //end of this.make_weight_matrices



Brain.prototype.make_layer = function(from_layer,from_to_weight_matrix) {

        //from layer is 1 x c
        //from_to_weight_matrix is c x x
        //new_layer is 1 x x
        new_layer = [];
        to_len = from_to_weight_matrix[0].length;
        from_len = from_layer.length;

        for(i=0;i<to_len;i++) {
            sum = 0.0;
            for(j=0;j<from_len;j++) {
                sum += from_layer[j] * from_to_weight_matrix[j][i];
            }
            new_layer[i] =  1.0/(1.0+Math.exp(-1.0*sum))
        } //end of loop on i
        return new_layer
} //end of make_layer

Brain.prototype.think = function(state) {
        this.input_layer = state;
        this.hidden_layer = this.make_layer(this.input_layer,this.input_to_hidden_weights);

        this.output_layer = this.make_layer(this.hidden_layer,this.hidden_to_output_weights);
        new_angle = this.output_layer[0]* Math.PI*2.0;

        return  new_angle;
} //end of think
