export type RoomDimensions = {
  length: number;
  width: number;
  height: number;
};

export function roomVolume({ length, width, height }: RoomDimensions) {
  return length * width * height;
}
