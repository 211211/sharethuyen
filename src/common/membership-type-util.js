import { reject, includes, map } from "lodash/collection";

import { CONSTANT } from "./config";

export default class MembershipTypeUtil {
  static removeDisabledRoles(roles, disabledUserTypes) {
    let disabledUserRoles = map(disabledUserTypes, function(type) {
      switch (type) {
        case "full":
          return "user_single";
        default:
          return type;
      }
    });

    return reject(roles, function(role) {
      return includes(disabledUserRoles, role.name);
    });
  }

  static removeDisabledMembershipType(membershipTypes, disabledUserTypes) {
    return reject(membershipTypes, function(membershipType) {
      return includes(disabledUserTypes, membershipType) || includes(disabledUserTypes, membershipType.name);
    });
  }

  static membershipTypeToSharepassLabel(membershipType) {
    let sharepassLabel = "";
    if (membershipType === CONSTANT.MEMBERSHIP_TYPE.full) {
      sharepassLabel = "FULL SHAREPASS";
    } else if (membershipType === CONSTANT.MEMBERSHIP_TYPE.mid_week) {
      sharepassLabel = "WEEKDAY SHAREPASS";
    } else if (membershipType === CONSTANT.MEMBERSHIP_TYPE.unlimited) {
      sharepassLabel = "UNLIMITED SHAREPASS";
    } else if (membershipType === CONSTANT.MEMBERSHIP_TYPE.shared) {
      sharepassLabel = "GROUP SHAREPASS";
    } else if (membershipType === CONSTANT.MEMBERSHIP_TYPE.daily) {
      sharepassLabel = "DAILY SHAREPASS";
    }

    return sharepassLabel;
  }

  static sharepassLabelToMembershipType(sharepassLabel) {
    let type = "";
    if (sharepassLabel === "FULL SHAREPASS") {
      type = CONSTANT.MEMBERSHIP_TYPE.full;
    } else if (sharepassLabel === "WEEKDAY SHAREPASS") {
      type = CONSTANT.MEMBERSHIP_TYPE.mid_week;
    } else if (sharepassLabel === "UNLIMITED SHAREPASS") {
      type = CONSTANT.MEMBERSHIP_TYPE.unlimited;
    } else if (sharepassLabel === "GROUP SHAREPASS") {
      type = CONSTANT.MEMBERSHIP_TYPE.shared;
    } else if (sharepassLabel === "DAILY SHAREPASS") {
      type = CONSTANT.MEMBERSHIP_TYPE.daily;
    }

    return type;
  }
}
