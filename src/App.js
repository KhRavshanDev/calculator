import { createContext, useState } from "react";
import { useContext } from "react";
import { Textfit } from 'react-textfit';
import './App.css';

const buttonValues = [
  ["AC", "+/-", "%", "/"],
  [7, 8, 9, "*"],
  [4, 5, 6, "-"],
  [1, 2, 3, "+"],
  [0, ".", "="],
];

function App() {
  return (
    <CalcProvider>
      <Calculator>
        <Display />
          <Keypad>
            {buttonValues.flat().map((btn, i) => (
              <Button 
                value={btn}
                key={i}
              />
            ))}
          </Keypad>
      </Calculator>
    </CalcProvider>
  );
}

const CalcContext = createContext()
const CalcProvider = ({ children }) => {
    const [calc, setCalc] = useState({
        sign: "",
        num: 0,
        res: 0
    });

    const providerValue = {
        calc, setCalc
    }



    return (
        <CalcContext.Provider value={providerValue}>
            {children}
        </CalcContext.Provider>
    )
}



const Calculator = ({ children }) => {
  return (
      <div className="calculator">{children}</div>
  )
}


const Display = () => {
  const { calc } = useContext(CalcContext);

  return (
      <Textfit className="display" max={70} mode="single">{calc.num ? calc.num : calc.res}</Textfit>
  )
}


const Keypad = ({ children }) => {
  return (
      <div className="keypad">{children}</div>
  )
}


const getStyleName = btn => {
  const className = {
      '=': 'equals',
      '*': 'opt',
      '-': 'opt',
      '+': 'opt',
      '/': 'opt',
      'AC': 'clr',
      '+/-': 'opt',
      '%': 'opt',
  }
  return className[btn]
}

const Button = ({ value }) => {
  const { calc, setCalc } = useContext(CalcContext);

  // User click comma
  const commaClick = () => {
      setCalc({
          ...calc,
          num: !calc.num.toString().includes('.') ? calc.num + value : calc.num
      })
  }

  // User click C
  const resetClick = () => {
      setCalc({ sign: '', num: 0, res: 0 })
  }

  // User click number
  const handleClickButton = () => {
      const numberString = value.toString()

      let numberValue;
      if(numberString === '0' && calc.num === 0) {
          numberValue = "0"
      } else {
          numberValue = Number(calc.num + numberString)
      }

      setCalc({
          ...calc,
          num: numberValue
      })
  }

  // User click operation
  const signClick = () => {
      setCalc({
          sign: value,
          res: !calc.res && calc.num ? calc.num : calc.res,
          num: 0
      })
  }

  const equalsClick = () => {
      if(calc.res && calc.num) {
      const math = (a, b, sign) => {
          const result = {
              '+': (a, b) => a + b,
              '-': (a, b) => a - b,
              '*': (a, b) => a * b,
              '/': (a, b) => a / b,
          }
          return result[sign](a, b);
          }
      setCalc({
      res: math(calc.res, calc.num, calc.sign),
      sign: '',
      num: 0
      })
      }
  }

  // Users click persen
  const persenClick = () => {
      setCalc({
          num: (calc.num / 100),
          res: (calc.res / 100),
          sign: ''
      })
  }

  // User click invert button
  const invertClick = () => {
      setCalc({
          num: calc.num ? calc.num * -1 : 0,
          res: calc.res ? calc.res * -1 : 0,
          sign: ''
      })
  }

  const handleBtnClick = () => {
      
      const results = {
          '.': commaClick,
          'AC': resetClick,
          '/': signClick,
          '*': signClick,
          '-': signClick,
          '+': signClick,
          '=': equalsClick,
          '%': persenClick,
          '+/-': invertClick
      }
      if(results[value]) {
          return results[value]()
      } else {
          return handleClickButton()
      }
  }

  return (
      <button onClick={handleBtnClick} className={`${getStyleName(value)} button`}>{value}</button>
  )
}

export default App;