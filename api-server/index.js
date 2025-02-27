const express = require('express');

const app = new express();

const { getMin, getMax, getAverage, getSortArray, getOccurance, swap, isExist } = require('./util.js');


app.get('/isExist', (req, res) => {
    const {num1}=req.query;
    const arr = [1, 2, 3, 4, 5, 11, 10, 9, 8, 7, 6];
    arr.sort((a, b) => a - b);

    res.json({ Array: arr, "Number": num1, isExist: isExist(parseInt(num1), arr) });
});

app.get('/number/swap', (req, res) => {
    let { x, y } = req.query;
    res.json(swap(x,y));
});


app.get('/number/min', (req, res) => {
    const num1 = parseInt(req.query.num1);
    const num2 = parseInt(req.query.num2);

    const result = getMin(num1, num2);
    res.status(result.status).json(result.data);
});

app.get('/number/max', (req, res) => {
    const num1 = parseInt(req.query.num1);
    const num2 = parseInt(req.query.num2);

    const result = getMax(num1, num2);
    res.status(result.status).json(result.data);
});

app.get('/number/avg', (req, res) => {
    const {numbers} = req.query;

    const result = getAverage(numbers);
    res.status(result.status).json(result.data);
});

app.get('/number/sort', (req, res) => {
    const {numbers, type} = req.query;

    const result = getSortArray(numbers,type);
    res.status(result.status).json(result.data);
});

app.get('/number/count', (req, res) => {
    const {values, search} = req.query;

    const result = getOccurance(values,search);
    res.status(result.status).json(result.data);
});


app.listen(3000, () => {
    console.log(`server is running on 3000`);
});
