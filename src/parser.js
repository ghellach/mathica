export default function (arg) {

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


    // parse string to computable array


    const functions = {
        a: ["arcsin", "arccos", "arctan", "arccsc", "arcsec", "arccot"],
        c: ["cos", "csc", "cot"],
        s: ["sin", "sec"],
        t: ["tan"],
        l: ["ln", "log"]
    }
    function toArray(str) {
        let open = false;
        let openCount = 0;
        let closeCount = 0;

        let arrLoc = 0;
        let final = [""];

        str.split("").forEach(c => {
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
        })

        if(openCount !== closeCount) return false;

        const toBeReturned = [];
        final.forEach((a, i) => i !== 0 ? toBeReturned.push(a): null);
        return toBeReturned;
    }

    function sortOut (s) {
        const arr = toArray(s);
        if(!arr) return false;

        return arr.map(item => {
            let pr = false;
            item.split("").forEach(char => char == "(" || char == ")" ? pr = true : null);

            if(pr) {
                const ev = sortOut(item);
                if(!ev) return false;
                else return ev;
            }else return item;
        })
    }


    const parsed = sortOut(String(arg).replace(",", ""));
    console.log(parsed);
    if(!parsed) return {
        error: "paranthesis mismatch"
    }





    return {
        raw: arg,
        parsed: parsed,
        guesses: {
            first: "algebric",
        },
        computedDate: new Date
    }
}