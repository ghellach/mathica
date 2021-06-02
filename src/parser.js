// workers relied on during parsing stage

const functions = {
    a: ["arcsin", "arccos", "arctan", "arccsc", "arcsec", "arccot"],
    c: ["cos", "csc", "cot"],
    i: ["deriv"],
    i: ["integ"],
    l: ["ln", "log"],
    s: ["sin", "sec"],
    t: ["tan"],
};

function toNumberIfPossible (char) {
    if(
        char == "0"
        || char == "1"
        || char == "2"
        || char == "3"
        || char == "4"
        || char == "5"
        || char == "6"
        || char == "7"
        || char == "8"
        || char == "9"
    ) return Number(char);
    else return char;
}

/**
    * This functional parser does the following
    * 1) Checks if expression string only contains allowed characters
    * 2) Converts the string expression into an array depending on parenthesis. Returns false if array mismatch.
    * 3) Merges numbers which had been seperated due to string => array conversion
    * 4) PENDING!!! looks for function expressions like sin, cos, tan, log, ln...
* */

export default function (arg) {

    // step 1: correct characters check
    let next = true;
    String(arg).split('').forEach(c => {
        let found = false;
        ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
            "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s",
            "t", "u", "v", "w", "x", "y", "z", "(", ")", "+", "-", "*", "/", "^", "!", "%", "="
        ].forEach(a => c == a ? found = true : null);
        if(!found) next = false;
    });

    if(!next) return {
        error: "characters verification failed"
    }


    //////////////////////////// 
    // step 2: parses string to computable array

    function toArray(str) {
        let open = false;
        let openCount = 0;
        let closeCount = 0;

        let arrLoc = 0;
        let final = [""];
        
        const chain = str.split("");
        function charExam(i) {
            console.log(final);
            const c = chain[i];
            if(c !== "(" && c !== ")") {
                if(open) {
                    final[arrLoc] = final[arrLoc] + c;
                }else {
                    arrLoc = arrLoc+1;
                    final.push(c);
                }
            }else if(c == "(") {
                openCount = openCount + 1;
                if(open) {
                    final[arrLoc] = final[arrLoc] + c;
                }else {
                    open = true;
                    arrLoc = arrLoc + 1;
                    final.push("");
                }
            }else if(c == ")") {
                console.log(open);
                closeCount = closeCount + 1;
                if(open) {
                    if(openCount == closeCount) {
                        open = false;
                        arrLoc = arrLoc + 1;
                    }else {
                        final[arrLoc] = final[arrLoc] + c;
                    }
                    

                }else final.push(")")
            }

            if(i < chain.length - 1) charExam(i+1);
        };

        charExam(0);

        if(openCount !== closeCount) return false;

        const toBeReturned = [];
        final.forEach((a, i) => i !== 0 ? toBeReturned.push(a): null);
        return toBeReturned;
    }

    function sortOut (s) {
        console.log(s);
        const arr = toArray(s);
        if(!arr) return false;

        return arr.map(item => {
            if(item == undefined) {return null};
            let pr = false;
            item.split("").forEach(char => char == "(" || char == ")" ? pr = true : null);

            if(pr) {
                const ev = sortOut(item);
                if(!ev) return false;
                else return ev;
            }else {
                if(item.split("").length !== 1) {
                    const ev = sortOut(item);
                    if(!ev) return false;
                    else return ev;
                }else return item;
            };
        })
    }


    let parsed = sortOut(String(arg).replace(",", ""));
    if(!parsed) return {
        error: "paranthesis mismatch"
    }


    /////////////////////////// 
    // step 3: Merges numbers which had been seperated due to string => array conversion

    function groupNumbers (arr) {
        let current = 0;

        let final = [];

        function go(i) {
            const c = toNumberIfPossible(arr[i]);
            if(i == 0) {
                final.push(c);
            }
            else {
                if(typeof c === "number") {
                    if (typeof toNumberIfPossible(final[current]) === "number") {
                        final[current] = Number(String(final[current])+String(c));
                    }else {
                        current = current + 1;
                        final.push(c);
                    }
                }else {
                    current = current + 1;
                    final.push(c);
                }
            }

            i !== arr.length - 1 ? go(i+1) : null;
            
        }

        go(0);

        let toBeReturned = [];
        final.forEach(o => {
            if (o == null||o == undefined) null;
            else toBeReturned.push(o);
        })
        
        return toBeReturned;
    }

    function grouperProcess(a) {
        const ev = groupNumbers(a)
        return ev.map(arr => {
            if(typeof arr === "object") return grouperProcess(arr);
            return arr;
        });
    };

    parsed = grouperProcess(parsed);


    // step 4: identifies trigo, integral, log and ... functions

    function groupIdentity(arg) {

        const final = [];

        function each (i) {
            const char = arg[i];
            if (functions[char]) {
                const series = functions[char];
                let found = false;
                let foundString = ""
                series.forEach(fn => {
                    let toBeCompared = "";
                    for(let j = 0; j < fn.split("").length; j++) toBeCompared = String(toBeCompared) + String(arg[i+j]);
                    if(toBeCompared == fn) {
                        found = true;
                        foundString = fn;
                        
                    }
                });
                
                if(found) {
                    final.push(foundString);
                    if(i < arg.length) each(i+foundString.split("").length);
                }else {
                    final.push(char);
                    if(i < arg.length) each(i+1);
                }
            }
            else {
                final.push(char);
                if(i < arg.length1) each(i+1);
            }
        }

        each(0);
        return final;

    };

    function mathFnProcess(a) {
        const ev = groupIdentity(a)
        return ev.map(arr => {
            if(typeof arr === "object") {
                const final = mathFnProcess(arr);
                const toBeReturned = [];
                final.forEach(f => {
                    if(f == null || f == undefined) null;
                    else toBeReturned.push(f);
                });
                return toBeReturned;
            }
            return arr;
        });
    };

    parsed = mathFnProcess(parsed)
    console.log(parsed);



    return {
        raw: arg,
        parsed: parsed,
        guesses: {
            first: "algebric",
        },
        computedDate: new Date
    }
}

