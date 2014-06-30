{
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
}

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

body
  = ( space? id:identifier space args:(boolean / expression / binding / integer / string / space )* ) {

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

    return {
        type: "Literal",
        value: flatten(content).join('')
    }
}

boolean
  = bool:( 'true' / 'false') {

    if (bool === 'true') return { type: 'Literal', value: true };
    if (bool === 'false') return { type: 'Literal', value: false };
}

bindingpart
  = ([a-zA-Z\=\*:] [a-zA-Z0-9_\=\*-:]*)

binding
  = binding:(bindingpart ( '.' bindingpart)*) {


  return {
    type: 'Binding',
    keypath: flatten(binding).join('')
  };
}


identifier
  = identifier:([a-zA-Z\=\*:] [a-zA-Z0-9_\=\*-:.]*) {

  return flatten(identifier).join('');
}

space
  = [\t\r\n ]+ { return ""; }

comment
  = "#" .*
