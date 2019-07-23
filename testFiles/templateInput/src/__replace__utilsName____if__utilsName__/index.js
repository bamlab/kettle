import hello from 'world';

function __replace__utilsName__(random) {
  // __if__isDebug__
  setupDebug(random);
  // __endif__
  // __if__isProd__
  setupProd(random);
  // __endif__
  return hello();
}
