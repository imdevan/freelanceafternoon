var nav = window.nav || {};

nav.TopNav= function() {
  this.container = document.querySelector("[data-top-nav='container']");
  this.icon = document.querySelector("[data-top-nav='icon']");
  this.text = document.querySelector("[data-top-nav='text']");
  this.elements = [this.container, this.icon, this.text];
  this.position = 0;
  this.theFold = 500;
}

nav.TopNav.prototype.init = function() {
    window.setInterval(this.updateFrame.bind(this), 150);
}

nav.TopNav.prototype.updateFrame = function() {
  var pos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop,
      ths = this;

  if (pos < ths.theFold){
    ths.container.classList.add('onTop');
  } else {
    ths.container.classList.remove('onTop');
  }
  if (pos < ths.position) {
    ths.container.classList.remove('hide');
  } else if (pos > ths.position) {
    ths.container.classList.add('hide');
  }

  ths.position = pos;
}

nav.TopNav.prototype.onTop = function() {
    return pos < 1
}

nav.instance = new nav.TopNav;
nav.instance.init();
