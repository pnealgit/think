function make_genomes(team) {
    gl = (team.num_inputs * team.num_hidden) + (team.num_hidden * team.num_outputs);
    for(var irr=0;irr<team.num_rovers;irr++) {
        team.genomes[irr] = make_genome(irr,gl);
    }
} //end of function

function make_genome(i,gl) {
    genome = {};
    junk = [];
    for (j = 0;j<gl;j++) {
      junk[j] = getRandomFloat(-2,2);
    } //end of loop for individual genome
    genome.id = i;
    genome['score'] = 0;
    genome['dna_string'] = junk;
    return genome
} //end of function make genomes

function crossover(p1,p2) {
        cspot = Math.floor(p1.length/2);
        c1 = []
        c2 = []
        c1a = p1.slice(0,cspot)
        c1b = p1.slice(cspot);
        c2a = p2.slice(0,cspot)
        c2b = p2.slice(cspot);
        c1 = c1a.concat(c2b);
        c2 = c2a.concat(c1b);
        return [c1,c2];
    } //end of crossover

function getSortedKeys(obj) {
        var keys = []; for(var key in obj) keys.push(key);
        return keys.sort(function(a,b){return obj[b]-obj[a]});
}


function mutate_genomes() {
     //skip very best ... if i did the select right
     for(var ik=2;ik<this.num_rovers;ik++) {
         spot = getRandomInt(0,this.gl);
         new_weight = getRandomFloat(-2,2);
         this.genomes[ik][spot] = new_weight;
     } //end of loop on new_rovers
} //end of function

function select_genomes(team) {
    //this is always a pain.
    genomes = team.genomes;
    var keys = [];
    new_dna_strings = [];
    keys = make_rewards(genomes);
    spot = 2;
    for(i=0;i<spot;i++) {
      iz = keys[i];
      genomes[i] = genomes[iz];
      genomes[i].score = 0;
    }
    //like to forget about sexual reproduction -- just crank up mutation
    //but alas !

    for (kk = spot;kk<num_rovers;kk++) {
        i1 = getRandomInt(0,5);
        i2 = getRandomInt(0,5);
        newbies = [];
        newbies = crossover(genomes[keys[i1]].dna_string,genomes[keys[i2]].dna_string);
        new_dna_strings[kk] = newbies[0];
    }
    for (kk = spot;kk<num_rovers;kk++) {
        genomes[kk].dna_string  = new_dna_strings[kk];
        genomes[kk].score = 0;
    }
    team.genomes = genomes;
} //end of select_genomes

function make_rewards(genomes) {
    //set up a hash, sort it to get the new genome rankings
    var sum = 0.0;
    var rewards = {};
    for (var irw = 0;irw< num_rovers;irw++) {
       rewards[irw] = genomes[irw].reward;
       sum += genomes[irw].reward;
       genomes[irw].reward = 0;
    } //end of loop on num_rovers
  //console.log('rewards; ',rewards);
    console.log("team -- SUM REWARDS: ",sum);
    skeys = getSortedKeys(rewards);
   // console.log('KEYS,REWARDS ',skeys,rewards);
    return skeys;
} //end of function



