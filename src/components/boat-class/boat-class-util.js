class BoatClassUtil {
  static mapBoatClass(boatClass) {
    return {
      id: boatClass.id,
      name: boatClass.name || "",
      color_hex: boatClass.color_hex || "",
      order_number: boatClass.order_number || 0,
      admin_use: boatClass.admin_use || 0
    };
  }
}

export default BoatClassUtil;
