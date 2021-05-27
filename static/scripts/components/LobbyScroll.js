class ScrollBehavior {
  constructor() {
    this.lastScroll = null;
    this.initScrollBehav();
  }
  initScrollBehav() {
    window.addEventListener("scroll", this.scrollHandler);
  }
  scrollHandler(e) {
    console.log(e.offsetTop);
  }
  /**
   *Checks if user is scrolling up or down
   * @param {number} offsetTop offset from event
   * @returns {boolean}
   *  - true if scrolling up
   *  -false if scrolling down
   */
  checkScrollDirection(offsetTop) {
    if (this.lastScroll == null) this.lastScroll = offsetTop;
    if (this.lastScroll > offsetTop) return true;
    else return false;
  }
  freez() {
    window.removeEventListener("scroll");
  }
}

export default ScrollBehavior;
