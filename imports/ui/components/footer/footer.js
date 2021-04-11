import './footer.html';

Template.footer.helpers({
  currentYear() {
    return new Date().getFullYear();
  },
});
