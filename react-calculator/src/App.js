import {useReducer} from "react"
import "./style.css"
import DigitButton from "./DigitButton"
import OperationButton from "./OperationButton"

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERAND: "choose-operand",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
}

function reducer(state,{type,payload}){
  switch(type){
    case ACTIONS.ADD_DIGIT:
      if(state.overwrite){
        return{
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }
      if (payload.digit === "0" && state.currentOperand ==="0") return state
      if (payload.digit === "." && state.currentOperand.includes(".")) return state

      return{
        ...state,
        currentOperand: '${currentoperand || ""}${payload.digit}',
      }
      case ACTIONS.CHOOSE_OPERAND:
        if(state.currentOperand == null && state.previosOperand == null){
          return state
        }

        if(state.currentOperand == null){
          return {
            ...state,
            operation: payload.operation,
          }
        }

        if(state.previosOperand == null){
          return{
            ...state,
            operation: payload.operation,
            previosOperand: state.currentOperand,
            currentOperand: null,
          }
        }
        return{
          ...state,
          previosOperand: evaluate(state),
          operation: payload.operation,
          currentOperand: null
        } 
      case ACTIONS.CLEAR:
        return{}
      case ACTIONS.DELETE_DIGIT:
        if(state.overwrite){
          return{
            ...state,
            overwrite: false,
            currentOperand: null
          }
        }
        if(state.currentOperand == null) return state
        if (state.currentOperand.length === 1){
          return{...state,currentOperand: null}
        } 
        return{
          ...state,
          currentOperand: state.currentOperand.slice(0,-1)
        } 
      case ACTIONS.EVALUATE:
        if(state.operation == null || state.currentOperand == null || state.previosOperand == null){
          return state
        }
        return{
          ...state,
          overwrite: true,
          previosOperand: null,
          operation: null,
          currentOperand: evaluate(state)
        }  
  }

}

function evaluate({currentOperand, previosOperand, operation}){
  const prev = parseFloat(previosOperand)
  const current = parseFloat(currentOperand)
  if (isNaN(prev) || isNaN(current)) return ""
  let computation = ""
  switch(operation){
    case "+":
      computation = prev + current
      break
    case "-":
      computation = prev - current
      break 
    case "*":
      computation = prev * current
      break 
    case "/":
      computation = prev / current
      break   
    
  }
  return computation.toString()   
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us",{
  maximumFractionDigits: 0,
})
function formatOperand(operand){
  if(operand == null) return; const [integer, decimal] = operand.split('.')
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return '$INTEGER_FORMATTER.format(integer)}.&(decimal)'/*to avoid print , in decimal numbers(after decimal point)*/
}

function App() {
  const [{currentOperand, previosOperand, operation},dispatch] = useReducer(reducer,{})
  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{formatOperand(previosOperand)}{operation}</div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>  
      </div>
      <button className="span-two" onClick={() => dispatch({type: ACTIONS.CLEAR})}>AC</button>
      <button onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT})}>DEL</button>
      <OperationButton operation="/" dispatch={dispatch}/>
      <DigitButton digit="1" dispatch={dispatch}/>
      <DigitButton digit="2" dispatch={dispatch}/>
      <DigitButton digit="3" dispatch={dispatch}/>
      <OperationButton operation="*" dispatch={dispatch}/>
      <DigitButton digit="4" dispatch={dispatch}/>
      <DigitButton digit="5" dispatch={dispatch}/>
      <DigitButton digit="6" dispatch={dispatch}/>
      <OperationButton operation="+" dispatch={dispatch}/>
      <DigitButton digit="7" dispatch={dispatch}/>
      <DigitButton digit="8" dispatch={dispatch}/>
      <DigitButton digit="9" dispatch={dispatch}/>
      <OperationButton operation="-" dispatch={dispatch}/>
      <DigitButton digit="." dispatch={dispatch}/>
      <DigitButton digit="0" dispatch={dispatch}/>
      <button className="span-two" onClick={() => dispatch({type: ACTIONS.EVALUATE})}>=</button>
    </div>
  )
}

export default App;
