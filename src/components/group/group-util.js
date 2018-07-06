class GroupUtil {
  static buildSubmitGroup(group) {
    var submitGroup = $.extend({}, group);

    submitGroup.user_ids = group.users.map(user => {
      return user.id;
    });
    delete submitGroup.users;
    return {
      group: submitGroup
    };
  }
}

export default GroupUtil;
