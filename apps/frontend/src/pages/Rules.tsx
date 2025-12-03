import React from "react";

const Rules = () => {
  // Style generator for frames
  const frameStyle = (top: number): React.CSSProperties => ({
    width: "1451px",
    height: "248px",
    left: "calc(50% - 1451px/2)",
    top: `${top}px`,
    position: "absolute",
  });

  // Diagonal line style generator
  const diagonal = (left: number): React.CSSProperties => ({
    width: "128.46px",
    border: "1px solid #FFFFFF",
    left: `${left}px`,
    top: "51px",
    transform: "rotate(-54.83deg)",
    position: "absolute",
  });

  // Shared text styles inside each frame
  const textStyle = {
    number: {
      width: "22px",
      height: "49px",
      left: "64px",
      top: "29px",
      fontFamily: "'WhirlyBirdie'",
      fontWeight: 700,
      fontSize: "48px",
      lineHeight: "49px",
      display: "flex",
      alignItems: "center",
      letterSpacing: "0.01em",
      color: "#FFFFFF",
      position: "absolute" as const,
    },
    title: {
      width: "266px",
      height: "49px",
      left: "282px",
      top: "29px",
      fontFamily: "'WhirlyBirdie'",
      fontWeight: 700,
      fontSize: "24px",
      lineHeight: "49px",
      display: "flex",
      alignItems: "center",
      letterSpacing: "0.01em",
      color: "#FFFFFF",
      position: "absolute" as const,
    },
    desc: {
      width: "1189px",
      height: "78px",
      left: "64px",
      top: "134px",
      fontFamily: "'Poppins'",
      fontWeight: 500,
      fontSize: "28px",
      lineHeight: "39px",
      display: "flex",
      alignItems: "center",
      letterSpacing: "0.01em",
      color: "#FFFFFF",
      position: "absolute" as const,
    },
  };

  // top positions for 7 identical frames (20px gap)
  const frames = [436, 704, 972, 1240, 1508, 1776, 2044];

  return (
    <div className="relative w-full min-h-screen overflow-y-auto">
      {/* Header Rectangle */}
      <div
        className="absolute bg-black"
        style={{
          width: "1452px",
          height: "104px",
          left: "29.01px",
          top: "121px",
        }}
      ></div>

      {/* RULES */}
      <div
        className="absolute text-white"
        style={{
          width: "130px",
          height: "29px",
          left: "60.01px",
          top: "157px",
          fontFamily: "'WhirlyBirdie'",
          fontWeight: 700,
          fontSize: "24px",
          lineHeight: "29px",
        }}
      >
        RULES
      </div>

      {/* GAME RULES */}
      <div
        className="absolute"
        style={{
          width: "370px",
          height: "43px",
          left: "calc(50% - 370px/2)",
          top: "293px",
          fontFamily: "'WhirlyBirdie'",
          fontWeight: 700,
          fontSize: "36px",
          lineHeight: "43px",
          textAlign: "center",
          letterSpacing: "-0.02em",
          color: "#000000",
        }}
      >
        game rules
      </div>

      {/* Subtitle */}
      <div
        className="absolute"
        style={{
          width: "651px",
          height: "62px",
          left: "calc(50% - 651px/2 + 0.5px)",
          top: "334px",
          fontFamily: "'Poppins'",
          fontWeight: 500,
          fontSize: "24px",
          lineHeight: "62px",
          display: "flex",
          alignItems: "center",
          textAlign: "center",
          letterSpacing: "0.01em",
          color: "#000000",
        }}
      >
        Master the challenge with these essential guidelines
      </div>

      {/* 7 IDENTICAL FRAMES */}
      {frames.map((top, index) => (
        <div
          key={index}
          className="relative box-border bg-black border border-white"
          style={frameStyle(top)}
        >
          {/* Diagonal Lines */}
          <div style={diagonal(153)}></div>
          <div style={diagonal(853)}></div>
          <div style={diagonal(1053)}></div>
          <div style={diagonal(1253)}></div>

          {/* Horizontal Divider */}
          <div
            className="absolute"
            style={{
              width: "100%",
              height: 0,
              top: "104px",
              borderTop: "1px solid #FFFFFF",
            }}
          ></div>

          {/* Number */}
          <div style={textStyle.number}>1</div>

          {/* Title */}
          <div style={textStyle.title}>verification</div>

          {/* Description */}
          <div style={textStyle.desc}>
            winners will have to prove they’re real humans ( and real students )
            before collecting their glory.
          </div>
        </div>
      ))}
    </div>
  );
};

export default Rules;
