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
        console.log(str);
        let arrLoc = 0;
        let final = [[]];
        let open = false;

        let openCount = 0;
        let closeCount = 0;

        str.replace(",", "").split("").forEach((c, i) => {

            if(c != "(" && c != ")") final[arrLoc].push(String(c));
            else if(c == "(") {
                openCount = openCount+1;

                if(open) final[arrLoc].push(String(c));
                else {
                    open = true;
                    arrLoc = arrLoc+1;
                    final.push([]);
                }
            }
            else if(c == ")") {
                closeCount = closeCount+1;
                if(open && closeCount == openCount) {
                    arrLoc = arrLoc+1;
                    if(i !== str.split("").length - 1) final.push([]);
                    open = false;
                }
                else final[arrLoc].push(String(c));
            }
        });

        if(openCount !== closeCount) return false;

        const toBeReturned = [];

       

        final.forEach(a => (a.length !== 0) ? toBeReturned.push(a.filter(c => c !== ",")) : null);
        
        console.log(toBeReturned)
        return toBeReturned;

    }

    function sortOut (s) {
        const arr = toArray(String(s).replace(",", ""));
        if(!arr) return false;

        return arr.map(a => {
            const str = String(a).replace(",", "");
            let pr = false;
            a.forEach(char => {
                if(char == "(" || char == ")") pr = true;
            });

            if(pr) {
                const ev = sortOut(String(str).replace(",", ""));
                if(!ev) return false;
                else return ev;
            }   
            else return a;
        });
    }


    const parsed = sortOut(String(arg).replace(",", ""));
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