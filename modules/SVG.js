import Svg, { Path } from "react-native-svg";

export default function SVG({
  width = 30,
  height = 30,
  fill = "#000",
  d = "",
  style = "",
}) {
  
  return (
    <Svg
      width={width}
      height={height}
      viewBox={(width === height) ? "0 0 16 16" : `0 0 ${width} ${height}`}
      style={[...style]}
      >
      <Path
        fill={fill}
        d={d}
        />
    </Svg>
  );
}
