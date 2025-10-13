import { Dimensions } from "react-native";
 
const BASE_WIDTH = 375;
const BASE_HEIGHT = 736;
 
const { width, height } = Dimensions.get("window");
 
export const scale = (size: number) => (width / BASE_WIDTH) * size;
export const verticalScale = (size: number) => (height / BASE_HEIGHT) * size;
export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
  Dimensions.get("window");
 
// 👇 Default export as an object
export default {
  scale,
  verticalScale,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
};