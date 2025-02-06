
const SCREEN = document.querySelector('.equation');

const NUMBERS = document.querySelectorAll(".numbers");
const OPERATIONS = document.querySelectorAll(".operations");

let canOperate = false;

class equation {
    constructor() {
        this.equation = "";
    }

    calculateValue(equation) {
        this.equation = (typeof eval(this.equation)) != "undefined" ? eval(this.equation) : "";
        return eval(equation);
    }

    addValue(value) {
        this.equation += value;
        return this.equation;
    }

    setValue(value) {
        this.equation = value;
        return this.equation;
    }

    getValue() {
        return this.equation;
    }
}

let eq = new equation();


function handleNumber(e) {


    let num = e.target;

    eq.addValue(num.innerText);
    SCREEN.innerText = eq.getValue();

    canOperate = true;

    scrollToEnd();
}


function handleOperation(e) {


    let oper = e.target;

    switch (oper.id) {
        case "equal":
            eq.calculateValue();
            SCREEN.innerText = eq.getValue();
            break;
        case "clear":
            eq.setValue("");
            SCREEN.innerText = eq.getValue();
            break;
        default:
            if (canOperate) {
                eq.addValue(oper.innerText);
                SCREEN.innerText = eq.getValue();

                canOperate = false;

                scrollToEnd();
            }
            break;
    }
}

function scrollToEnd() {
    const scrollWidth = SCREEN.scrollWidth;
    document.querySelector(".screen").scrollLeft = scrollWidth;
}


NUMBERS.forEach((num) => {
    num.addEventListener('click', handleNumber);
});

OPERATIONS.forEach((oper) => {
    oper.addEventListener('click', handleOperation);
});