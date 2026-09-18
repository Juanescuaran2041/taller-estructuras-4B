import { Equipment, TypeEquipment } from "../../src/Equipment.js";

export function buildSampleInventory(): Equipment[] {
  const codes: [string, TypeEquipment][] = [
    ["LAPTOP-01", TypeEquipment.LAPTOP],
    ["LAPTOP-02", TypeEquipment.LAPTOP],
    ["LAPTOP-03", TypeEquipment.LAPTOP],
    ["LAPTOP-04", TypeEquipment.LAPTOP],
    ["LAPTOP-05", TypeEquipment.LAPTOP],
    ["KIT-01", TypeEquipment.KIT],
    ["KIT-02", TypeEquipment.KIT],
    ["KIT-03", TypeEquipment.KIT],
    ["KIT-04", TypeEquipment.KIT],
    ["MULT-01", TypeEquipment.MULTIMETER],
    ["MULT-02", TypeEquipment.MULTIMETER],
    ["MULT-03", TypeEquipment.MULTIMETER],
  ];

  return codes.map(([code, type]) => new Equipment(code, type));
}
