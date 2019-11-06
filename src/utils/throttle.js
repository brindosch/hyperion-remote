export const throttle = (fn, wait) => {
  let isThrottled = false,
    lastArgs = null;
  return function wrapper() {
    if (isThrottled) {
      lastArgs = arguments;
    } else {
      fn.apply(this, arguments);
      isThrottled = setTimeout( () => {
        isThrottled = false;
        if (lastArgs) {
          wrapper.apply(this, lastArgs);
          lastArgs = null;
        }
      }, wait);
    }
  }
}
