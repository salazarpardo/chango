import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

Template.registerHelper('postId', () => {
  return FlowRouter.getParam('_id');
});

Template.registerHelper('pluralize', function(n, thing) {
  // fairly stupid pluralizer
  if (n === 1) {
    return '1 ' + thing;
  } else {
    return n + ' ' + thing + 's';
  }
});
