// Called when the Gatsby browser runtime first starts.
export const onClientEntry = () => {
  // IntersectionObserver polyfill for Safari, IE
  if (!(`IntersectionObserver` in window)) {
    import(`intersection-observer`);
  }
}
