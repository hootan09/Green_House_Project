import {
    Canvas,
    LinearGradient,
    Path,
    Skia,
    Text,
    useFont,
    vec,
  } from "@shopify/react-native-skia";
  import React from "react";
  import { StyleSheet, View, Dimensions } from "react-native";
  
  import * as d3 from "d3";
  
  const {width, height} = Dimensions.get('screen')
  const GRAPH_MARGIN = 20;
  const GRAPH_BAR_WIDTH = 8;
  
  const CanvasHeight = 350;
  const CanvasWidth = width;
  const graphHeight = CanvasHeight - 2 * GRAPH_MARGIN;
  const graphWidth = CanvasWidth - 2;
  
  export const BarChart = ({ samples }) => {
    const data = [
      { label: "0HR", value: samples[0] },
      { label: "1HR", value: samples[1] },
      { label: "2HR", value: samples[2] },
      { label: "3HR", value: samples[3] },
      { label: "4HR", value: samples[4] },
      { label: "5HR", value: samples[5] },
      { label: "6HR", value: samples[6] },
      { label: "7HR", value: samples[7] },
      { label: "8HR", value: samples[8] },
      { label: "9HR", value: samples[9] },
      { label: "0HR", value: samples[0] },
      { label: "1HR", value: samples[1] },
      { label: "2HR", value: samples[2] },
      { label: "3HR", value: samples[3] },
      { label: "4HR", value: samples[4] },
      { label: "5HR", value: samples[5] },
      { label: "6HR", value: samples[6] },
      { label: "7HR", value: samples[7] },
      { label: "8HR", value: samples[8] },
      { label: "9HR", value: samples[9] },
    ];
  
    const font = useFont(require("../assets/fonts/Roboto-Regular.ttf"), 10);
  
    const xDomain = data.map((dataPoint) => dataPoint.label);
    const xRange = [0, graphWidth];
    const x = d3.scalePoint().domain(xDomain).range(xRange).padding(1);
  
    const yDomain = [
      0,
      d3.max(data, (yDataPoint) => yDataPoint.value),
    ];
  
    const yRange = [0, graphHeight];
    const y = d3.scaleLinear().domain(yDomain).range(yRange);
  
    const newPath = Skia.Path.Make();
  
    data.forEach((dataPoint) => {
      const rect = Skia.XYWHRect(
        x(dataPoint.label) - GRAPH_BAR_WIDTH / 2,
        graphHeight,
        GRAPH_BAR_WIDTH,
        y(dataPoint.value * 1) * -1
      );
  
      const rrect = Skia.RRectXY(rect, 8, 8);
      newPath.addRRect(rrect);
    });
  
    if (!font) {
      return <View />;
    }
  
    return (
      <View style={styles.container}>
        <Canvas style={styles.canvas}>
          <Path path={newPath}>
            <LinearGradient
              start={vec(100, 100)}
              end={vec(120, 225)}
              colors={["#63C5DA", "#0492C2"]}
            />
          </Path>
          {data.map((dataPoint, index) => (
            <Text
              color={"white"}
              key={index}
              font={font}
              x={x(dataPoint.label) - 10}
              y={CanvasHeight - 25}
              text={dataPoint.label}
            />
          ))}
        </Canvas>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
      backgroundColor: "black",
    },
    canvas: {
      height: CanvasHeight,
      width: CanvasWidth,
    },
  });