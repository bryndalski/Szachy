"use strict";
/**
 * Controlls scroll behavior
 * Detects scrolling up or down
 * @freez
 */
class ScrollBehavior {
  constructor() {
    this.scrollUp = new CustomEvent("scrollUp");
    this.scrollDown = new CustomEvent("scrollDown");
    this.lastScroll = null;
  }
  /**
   * Initialize scroll listener
   */
  initScrollBehav() {
    window.addEventListener("scroll", this.checkScrollDirection);
  }
  /**
   *Checks if user is scrolling up or down
   * @returns {Event}
   *  - scrollUp if scrolling up
   *  - scrollDown if scrolling down
   */
  checkScrollDirection = () => {
    if (this.lastScroll == null) this.lastScroll = window.pageYOffset;
    if (this.lastScroll > window.pageYOffset) {
      this.lastScroll = window.pageYOffset;
      dispatchEvent(this.scrollUp);
    } else {
      this.lastScroll = window.pageYOffset;
      dispatchEvent(this.scrollDown);
    }
  };
  freez() {
    window.removeEventListener("scroll", this.checkScrollDirection);
  }
}
export default ScrollBehavior;
