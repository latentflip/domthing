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


// from https://github.com/dmajda/pegjs/blob/master/examples/javascript.pegjs#L297
string "string"
  = '"' chars:DoubleStringCharacter* '"' {
      return { type: "Literal", value: chars.join("") };
    }
  / "'" chars:SingleStringCharacter* "'" {
      return { type: "Literal", value: chars.join("") };
    }

DecimalDigit = [0-9]
HexDigit = [0-9a-f]i

DoubleStringCharacter
  = !('"' / "\\") . { return text(); }
  / "\\" sequence:EscapeSequence { return sequence; }

SingleStringCharacter
  = !("'" / "\\") . { return text(); }
  / "\\" sequence:EscapeSequence { return sequence; }

EscapeSequence
  = CharacterEscapeSequence
  / "0" !DecimalDigit { return "\0"; }
  / HexEscapeSequence
  / UnicodeEscapeSequence

CharacterEscapeSequence
  = SingleEscapeCharacter
  / NonEscapeCharacter

SingleEscapeCharacter
  = "'"
  / '"'
  / "\\"
  / "b"  { return "\b";   }
  / "f"  { return "\f";   }
  / "n"  { return "\n";   }
  / "r"  { return "\r";   }
  / "t"  { return "\t";   }
  / "v"  { return "\x0B"; }   // IE does not recognize "\v".

NonEscapeCharacter
  = !(EscapeCharacter) . { return text(); }

EscapeCharacter
  = SingleEscapeCharacter
  / DecimalDigit
  / "x"
  / "u"

HexEscapeSequence
  = "x" digits:$(HexDigit HexDigit) {
      return String.fromCharCode(parseInt(digits, 16));
    }

UnicodeEscapeSequence
  = "u" digits:$(HexDigit HexDigit HexDigit HexDigit) {
      return String.fromCharCode(parseInt(digits, 16));
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
  = identifier:([a-zA-Z\=\*:\/\+\<\>\-\%] [a-zA-Z0-9_\=\*-:.]*) {

  return flatten(identifier).join('');
}

space
  = [\t\r\n ]+ { return ""; }

comment
  = "#" .*
