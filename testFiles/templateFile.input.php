<?php

function __replace__fName__($random) {
  // __if__isWorld__
  spin($random);
  // __endif__
  # __if__isSun__
  shine($random);
  # __endif__
  return hello();
}
