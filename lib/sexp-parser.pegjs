start
  = expression


integer "integer"
  = digits:[0-9]+ {

    return {
        type: 'Literal',
        value: parseInt(digits.join(""), 10)
    }
}


expression
  = (space? '(' body:body ')' space?) {

    return {
        type: 'Expression',
        name: body.identifier,
        arguments: body.args
    };
}

//body
//  = body:( expression / identifier / integer / string / space )* { return body.filter(function(a) { return (a != ""); }) }


body
  = ( space? id:identifier space args:(expression / binding / integer / string / space )* ) {

    return {
        identifier: id,
        args: args.filter(function(a) { return (a != ""); })
    };
}


//float
//  = float:(('+' / '-')? [0-9]+ (('.' [0-9]+) / ('e' [0-9]+))) {
//    
//    return float;
//}


string
  = '"' content:([^"\\] / "\\" . )* '"' {

    function concat(o,i){
        var r=[];
        for(var p in o){
            r.push(o[p]);
        }
        return r.join("");
    }

    return {
        type: "Literal",
        value: concat(content)
    }
}


bindingpart
  = ([a-zA-Z\=\*:] [a-zA-Z0-9_\=\*-:]*)

binding
  = binding:(bindingpart ( '.' bindingpart)*) {

  function flatten(arr) {
    var res = [], item;
    for (var i in arr) {
        item = arr[i];
        if (Array.isArray(item)) {
            res = res.concat(flatten(item));
        } else {
            res.push(item);
        }
    }
    return res;
  }

  return {
    type: 'Binding',
    keypath: flatten(binding).join('')
  };
}


identifier
  = identifier:([a-zA-Z\=\*:] [a-zA-Z0-9_\=\*-:.]*) {

  function concat(o,i){
    var r=[];
    for(var p in o){
        r.push(o[p]);
    }
    return r.join("");
  }
    
  return identifier.map(function(a) {return concat(a)}).join("");
}



space
  = [\s\n ]+ { return ""; }

comment
  = "#" .*
