import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

Template.registerHelper('postId', () => {
  return FlowRouter.getParam('_id');
});
