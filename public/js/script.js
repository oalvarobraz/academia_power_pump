function toggleNav() {
    const navItems = document.querySelector('.nav-items');
    navItems.classList.toggle('show');
    document.querySelector('.navbar').classList.toggle('show');
  
    const menuIcon = document.querySelector('.menu-icon');
    menuIcon.classList.toggle('rotate');
    menuIcon.classList.toggle('align');
    
    const navLinks = document.querySelectorAll('.nav-items li a');
  
    const miniNavItems = document.querySelector('.mini-nav-items');
    miniNavItems.classList.toggle('hide');
  
    if (navItems.classList.contains('show')) {
      navLinks.forEach(link => link.style.fontSize = 'medium');
    } else {
      navLinks.forEach(link => link.style.fontSize = 'small');
    }
  }
