import React, { useState } from "react";
import { my_calculator_backend } from "/home/tanya/quadB_Tanya/day_1/my_calculator/src/declarations/my_calculator_backend";
import "./index.scss"; // Import styles
//import "./Calculator.css"; // Import CSS for styling

const App = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  const handleClick = (value) => {
      setInput(input + value);
  };

  const clearInput = () => {
      setInput("");
      setResult("");
  };

  const calculate = async () => {
      const match = input.match(/(\d+)([\+\-\*\/])(\d+)/);
      if (!match) {
          setResult("Invalid Input");
          return;
      }

      const num1 = parseInt(match[1]);
      const operator = match[2];
      const num2 = parseInt(match[3]);

      try {
          let res;
          switch (operator) {
              case "+":
                  res = await my_calculator_backend.add(num1, num2);
                  break;
              case "-":
                  res = await my_calculator_backend.subtract(num1, num2);
                  break;
              case "*":
                  res = await my_calculator_backend.multiply(num1, num2);
                  break;
              case "/":
                  res = await my_calculator_backend.divide(num1, num2);
                  break;
              default:
                  res = "Invalid Operation";
          }
          setResult(res.toString()); // Ensure the result is displayed as a string
      } catch (error) {
          console.error("Calculation error:", error);
          setResult("Error");
      }
  };

  return (
      <div className="calculator">
          <h2>Calculator</h2>
          <input type="text" value={input} readOnly />
          <div className="buttons">
              {[7, 8, 9, "/"].map((val) => (
                  <button key={val} onClick={() => handleClick(val)}>{val}</button>
              ))}
              {[4, 5, 6, "*"].map((val) => (
                  <button key={val} onClick={() => handleClick(val)}>{val}</button>
              ))}
              {[1, 2, 3, "-"].map((val) => (
                  <button key={val} onClick={() => handleClick(val)}>{val}</button>
              ))}
              {[0, "C", "=", "+"].map((val) => (
                  <button key={val} onClick={() => val === "=" ? calculate() : val === "C" ? clearInput() : handleClick(val)}>
                      {val}
                  </button>
              ))}
          </div>
          {result !== "" && <div className="result">= {result}</div>}
      </div>
  );
};

export default App;