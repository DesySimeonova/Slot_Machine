
const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS=3;

const SYMBOLS_COUNT = {
    A:2,
    B: 4,
    C: 6,
    D: 8
}

const SYMBOL_VALUES = {
    A: 5,
    B: 4,
    C: 3,
    D: 2
}



const deposit = () => {
    while (true) {
        const depositAmount = prompt("Enter a deposit amount: ");
        const numDepositAmount = parseFloat(depositAmount);

        if (isNaN(numDepositAmount) || numDepositAmount <= 0) {
            console.log("Invalid deposit amount! Try again!");
        } else {
            console.log("You deposited " + numDepositAmount + ".");
            return numDepositAmount;
        }
    }
};

const getNumberOfLines = () =>{
    while (true) {
        const lines = prompt("Enter a num of lines to bet on (between 1-3): ");
        const numLines = parseFloat(lines);

        if (isNaN(numLines) || numLines <= 0 || numLines > 3) {
            console.log("Invalid lines number! Try again!");
        } else {
            console.log("You will bet on " + numLines + " lines.");
            return numLines;
        }
    }
};

const getBet = (balance, numLines) => {
    while (true) {
        const bet = prompt("Enter the bet per line : ");
        const numBet = parseFloat(bet);

        if (isNaN(numBet) || numBet <= 0 || numBet > (balance / numLines)) {
            console.log("Invalid bet! Try again!");
        } else {
            console.log("You will bet " + numBet + "$.");
            return numBet;
        }
    }
};

const spin = () => {
    const symbols = []; 
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)){
        for(let i=0;i<count;i++){
            symbols.push(symbol);
        }
    }

    const reels=[];
    for(let i = 0; i< COLS; i++){
        reels.push([]);
        const reelSymbols = [...symbols];//make copy of the real symbols array in reelSymbols
        for(let j=0; j< ROWS; j++){
            const randomIndex=Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex,1);
        }
    }
    return reels;
};

const transpose = (reels) => {
    const rows = [];
    for(let i=0; i< ROWS; i++){
        rows.push([]);
        for(let j=0; j < COLS; j++){
            rows[i].push(reels[j][i]);
        }
    }
    return rows;
};

const printRows = (rows) =>{
    for(const row of rows){
        let rowString = "";
        for(const [i, symbol] of row.entries()){
            rowString+=symbol;
            if(i!=row.length-1){
                rowString+=" | ";
            }
        }
        console.log(rowString);
    }
};

const getWinnings = (rows, bet) => {
    let winnings=0;
    for(let i=0; i < ROWS; i++){
        const symbols = rows[i];
        let allSame=true;

        for(const symbol of symbols){
            if(symbol!=symbols[0]){
                allSame=false;
                break;
            }
        }

        if(allSame){
            winnings += bet * SYMBOL_VALUES[symbols[0]];
        }
    }
    return winnings;
};

const game = () => {
    let balance = deposit();

    while(true) {
        console.log("You have a balance of $" + balance);
        const numLines=getNumberOfLines();
        const bet = getBet(balance, numLines);
        balance -= bet * numLines;
        const reels = spin();
        const rows = transpose(reels);
        printRows(rows);
        const winnings = getWinnings(rows, bet);
        balance += winnings;
        console.log("You won, $" + winnings.toString());

        if(balance <= 0) {
            console.log("You run out of money!");
            break;
        }
        const playAgain = prompt("Do you wanna play again (y/n)?: ");
        if (playAgain != "y")
            break;
    }

};

game();

