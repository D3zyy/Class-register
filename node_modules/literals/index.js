var handle = {}

// NOTICE: YOU WANT TO GET DOWN TO THE LITERALS,
// AND MAYBE SIMPLE BINARY EXPRESSIONS (TO FORM RATIOS)

// this is the return function, but there is more block above it probably
// how to treat the two differently?

var literals = []

handle['Literal'] = function (lit){
  literals.push(lit)
}

handle['BlockStatement'] = function handleBlockStatement(block){
  block.body.forEach(function(e, i){
    var type = e.type
    handle[type](block.body[i])
  })
}

handle['FunctionExpression'] = function handleFunctionExpression(exp){
  var params = exp.params
  handle[exp.body.type](exp.body)
  // body is a probably a block statement
}

handle['IfStatement'] = function handleIfStatement(iff){
  // probably just need to parse iff.consequent
  var test = iff.test // likely a BinaryExpression
  var csq = iff.consequent // probably a block statement 
}

handle['AssignmentExpression'] = function handleAssignmentExpresiion(asg){
  handle[asg.left.type](asg.left)
  handle[asg.right.type](asg.rightt)
}

handle['MemberExpression'] = function(exp){
  if(!exp) return
  handle[exp.object.type](exp.object)
  handle[exp.property.type](exp.property)
}

handle['Identifier'] = function(i){
  return 'ID'
  // do nothing for now
}

handle['VariableDeclaration'] = function handleVariableDeclaration(v){
  v.declarations.forEach(function(e,i){
    handle[e.type](e)
  })
}

handle['WhileStatement'] = function(ws){
  handle[ws.test.type](ws.test)
  handle[ws.body.type](ws.body)
}

handle['VariableDeclarator'] = function handleVariableDeclarator(d){
  if(!d.init) return
  handle[d.init.type](d.init)
}

handle['ArrayExpression'] = function(exp){
  exp.elements.forEach(function(e,i){
    handle[e.type](e)
  })
}

handle['ReturnStatement'] = function handleReturn(fn){
  handle[fn.argument.type](fn.argument)
}

handle['BinaryExpression'] = function handleBinaryExpression(exp){
  if(!exp) return
  if(exp.left.type === exp.right.type === 'Literal'){
    handle[exp.left.type](exp.left)
    handle[exp.right.type](exp.right)
  }
  else{
    handle[exp.left.type](exp.left)
    handle[exp.right.type](exp.right)
  }
}

handle['FunctionDeclaration'] = function handleFunctionDeclaration(exp){
  var params = exp.params
  handle[exp.body.type](exp.body)
}

handle['ForStatement'] = function(f){
  handle[f.body.type](f.body)
}

handle['CallExpression'] = function handleCallExpression(expr){
  if(!expr) return
  expr.arguments.forEach(function(e,i){
    handle[e.type](e)
  })
}

handle['ExpressionStatement'] = function handleExpressionStateent(expr){
  handle[expr.expression.type](expr.expression)
}

handle['Program'] = function(program){
  program.body.forEach(function(e,i){
    handle[e.type](e)
  })
}


module.exports = function(ast){
  literals = []
  handle[ast.type](ast)
  return literals
}





/*
  notes: 
  * an "Expression statement" is a reference to a previously defined variable
  * * if it's expression.type is CallExpression, it's a function, and we may want paramif it's arguments
  * * if it's expression.type is AssignmentExpression, it's math, and  
  * "BinaryExpressions" are math, and will have right and left members, which will fork down FIOL style
  * * look for CallEspressions, and literals, within
  * * note that a binary expression "1 / 2" can be interpreted by the UI as a ratio


  things could and could not do:
  * mess with any expressionStatement that is an argument of it's context function
  * check to make sure a variable is referenced in a tree leading up to the return, before paramifying it (uhm....)

*/
