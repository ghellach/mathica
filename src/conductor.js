import parser from './parser.js';

export default function (arg) {

    // this conductor performs all required actions step by step and

    // step 1: parsing
    const exp = parser(arg);
    console.log(JSON.stringify(exp, null, 4));
}