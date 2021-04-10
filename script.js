class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.readyToRest = false;
        this.clear();
    }
    clear() {
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
        this.readyToRest = false;
        this.updateDisplay();
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        this.updateDisplay();
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        this.currentOperand = this.currentOperand.toString() + number.toString();
    }

    chooseOperation(operation) {
        if (this.currentOperand === "") return;
        if (this.currentOperand !== "") {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = "";
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) {
            return;
        }
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    this.previousOperandElement.innerText = '';
                    this.currentOperandElement.innerText = `нельзя делить на ноль`;
                    updateDisplay();
                    return;
                }
                computation = prev / current;
                break;
            case '^':
                computation = Math.pow(prev, current);
                break;
            default:
                return;
        }
        if(Number.isInteger(computation)) {
            computation = computation;
        } else {
            computation = +computation.toFixed(5);
        }
        this.currentOperand = computation;
        this.readyToReset = true;
        this.operation = undefined;
        this.previousOperand = '';
    }
    
    computeSqrt() {
        let computation;
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) {
            return;
        } else {
            computation = Math.sqrt(current);
            if (isNaN(computation)) {
                this.currentOperandElement.innerText = `нельзя выполнить операцию`;
                updateDisplay();
                return;
            }
        }
        this.currentOperand = computation;
        this.readyToReset = true;
        this.operation = undefined;
    }

    changeSing() {
        let number = this.currentOperand;
        number *= -1;
        this.currentOperand = number;
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat((stringNumber.split('.')[0]));
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0});
        }
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandElement.innerText = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            this.previousOperandElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandElement.innerText = '';
        }
        
    }
}

const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const clearButton = document.querySelector('[data-all-clear]');
const deleteButton = document.querySelector('[data-delete]');
const equalsButton = document.querySelector('[data-equals]');
const previousOperandElement = document.querySelector('[data-previous-operand]');
const currentOperandElement = document.querySelector('[data-current-operand]');

const calculator = new Calculator(previousOperandElement, currentOperandElement);

numberButtons.forEach(button => {
    button.addEventListener("click", () => {
        if(calculator.previousOperand === "" &&
                calculator.currentOperand !== "" &&
                calculator.readyToReset) {
            calculator.currentOperand = "";
            calculator.readyToReset = false;
        }
        calculator.appendNumber(button.innerText)
        calculator.updateDisplay();
    })
  })
  

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (button.innerText === '√') {
        calculator.computeSqrt(button.innerText);
        } else if (button.innerText === '±') {
            calculator.changeSing(button.innerText);
        } else {
            calculator.chooseOperation(button.innerText);
        }
        calculator.updateDisplay();
    });
});

equalsButton.addEventListener('click', () => {
    calculator.compute();
    calculator.updateDisplay();
});

clearButton.addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
});

deleteButton.addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
});