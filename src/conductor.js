import parser from './parser.js';

export default function (arg) {
    const express = parser(arg);
    console.log(JSON.stringify(express, null, 4));
}