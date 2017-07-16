function rollDice(){

   var x = Math.floor((Math.random() * 6) + 1); 
   return x

}


function guessMyAge(){

 var x = Math.floor((Math.random() * 100) + 1); 
   return x
   
}

function randomTenLetterString(){
    var result = randomString();

    return result;
}



function randomString() {
    var chars = "abcdefghiklmnopqrstuvwxyz";
    var string_length = 10;
    var randomstring = '';
    for (var i=0; i<string_length; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum,rnum+1);
    }
    return randomstring
}

var exports = {
    randomTenLetterString:randomTenLetterString,
    rollDice:rollDice,
    guessMyAge:guessMyAge
    
    
}

module.exports = exports