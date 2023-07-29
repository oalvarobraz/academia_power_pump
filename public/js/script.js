function toggleNav() {
    const navItems = document.querySelector('.nav-items');
    navItems.classList.toggle('show');
    document.querySelector('.navbar').classList.toggle('show');
  
    const icon = document.querySelector('.menu-icon ion-icon');
    if (icon.getAttribute('name') === 'menu-outline') {
      icon.setAttribute('name', 'close-outline');
    } else {
      icon.setAttribute('name', 'menu-outline');
    }
  
    const homeIcon = document.querySelector('.home-icon');
    const navLinks = document.querySelectorAll('.nav-items li a');
  
    const miniNavItems = document.querySelector('.mini-nav-items');
    miniNavItems.classList.toggle('hide');
  
    if (navItems.classList.contains('show')) {
      homeIcon.style.fontSize = 'medium';
      navLinks.forEach(link => link.style.fontSize = 'medium');
    } else {
      homeIcon.style.fontSize = 'small';
      navLinks.forEach(link => link.style.fontSize = 'small');
    }
  }
