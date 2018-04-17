import './comment_item.html';

Template.commentItem.helpers({
  submittedText() {
    return this.submitted.toString();
  }
});
