const getMin = (num1, num2) => {

    if (isNaN(num1) || isNaN(num2)) {
        return { status: 404, data: { message: `Cannot Compare value is ${isNaN(num1) ? 'Num1 = ' + num1 : 'Num2 = ' + num2} not a number` } };
    } else {
        return { status: 200, data: { "min": Math.min(num1, num2), "min2": num1 < num2 ? num1 : num2 } };
    }

};

const getMax = (num1, num2) => {

    if (isNaN(num1) || isNaN(num2)) {
        return { status: 404, data: { message: `Cannot Compare value is ${isNaN(num1) ? 'Num1 = ' + num1 : 'Num2 = ' + num2} not a number` } };
    } else {
        return { status: 200, data: { "max": Math.max(num1, num2) } };
    }

};

const getAverage = (numbers) => {
    //If "numbers" parameter declared or not assignd any values, check thorugh the IF block 
    if (numbers) {
        // Rejex test any numbers are mathing in text
        if (/\d+/.test(numbers)) {
            //one or numbers are exist in a text extract string number value on an array and 
            // Map as a number use calculation | Number is Parent of the Int and Float value
            const numberArray = numbers ? numbers.match(/\d+/g).map(Number) : [];
            return { status: 200, data: { average: numberArray.reduce((tot, num) => tot + num, 0) / numberArray.length } };
        } else {
            return { status: 404, data: { message: `Not Valid number value in array` } };
        }
    } else {
        return { status: 404, data: { message: `Parameter 'numbers' is undefined` } };
    }
}

const getSortArray = (numbers, type = 'asc') => {
    //If "numbers" parameter declared or not assignd any values, check thorugh the IF block 
    if (numbers) {
        // Rejex test any numbers are mathing in text
        if (/\d+/.test(numbers)) {
            //one or numbers are exist in a text extract string number value on an array and 
            // Map as a number
            let numberArray = numbers ? numbers.match(/\d+/g).map(Number) : [];

            //TolowerCase use for avoiding the Case sensitiveness
            if (type.toLowerCase() === 'asc' || type.toLowerCase() === 'desc') {
                // In built Function is Easiest way

                // We use in Bubble sort its more effeceint for our program
                // Re-Declaration is not important, array is not duplicated
                numberArray = sort(numberArray, type.toLowerCase());
            } else {
                return { status: 404, data: { message: `Not Valid type to sort the array | valid Types are ASC or DESC` } };
            }
            return { status: 200, data: { sorted: numberArray, type: type.toUpperCase() } };
        } else {
            return { status: 404, data: { message: `Not Valid number value in array` } };
        }
    } else {
        return { status: 404, data: { message: `Parameter 'numbers' is undefined` } };
    }
}

const sort = (arr, type) => {
    // Bubble sort
    // use for 'n' is fixed positoned and managed rotation 
    let n = arr.length;
    let swapped;
    do {
        // once swaped is false nothing swaped any element it mean sort is complete
        swapped = false;
        // Iterate and compare with every and each element
        for (let i = 0; i < n - 1; i++) {
            // Type is Asscending compare the next element less than the current element is it less than, then swap index 
            // Type is Descending compare the next element grater than the current element is it grate than, then swap index 
            // If is exceuted swap is done so we need compare again array so need do the do while that i change the "swapped=true;""
            // In looping time If is not executed is that say sorting is done
            if ((type === 'asc' && arr[i] > arr[i + 1]) || (type === 'desc' && arr[i] < arr[i + 1])) {
                // Swap elements
                let temp = arr[i];
                arr[i] = arr[i + 1];
                arr[i + 1] = temp;
                swapped = true;
            }
        }
        // Swappes Last index is Fixed
        n--;
    } while (swapped);
    return arr;
}

const getOccurance = (values, search) => {
    //If "values" parameter declared or not assignd any values, check thorugh the IF block 
    if (values) {
        //If "search" parameter declared or not assignd any values, check thorugh the IF block 
        if (search) {
            // Rejex test any commas are mathing in text
            if (/,+/.test(values)) {
                // Splitting Allthe values using in Comma
                // Filterate the without any white space values
                const arr = values.split(',').filter(e => e.trim() !== "");

                //TolowerCase use for avoiding the Case sensitiveness
                if (arr.length > 0) {
                    let occurance=0;

                    // METHOD 1
                    // let occurance= arr.filter(e => e.trim().toLowerCase() === search.trim().toLowerCase()).length;

                    // METHOD 2
                    // const matches = values.match(new RegExp(search, 'g'));
                    // occurance = matches ? matches.length : 0;

                    // METHOD 3
                    for (let i = 0; i < arr.length; i++) {
                        if (arr[i].trim().toLowerCase() === search.trim().toLowerCase()) {
                            occurance++;
                        }
                    }

                    return { status: 200, data: { occurance, sreach: search.toUpperCase() } };
                } else {
                    return { status: 404, data: { message: `Not Valid values in array` } };
                }
            } else {
                return { status: 200, data: { message: `Only one has a to Mathing`, values: values.toUpperCase(), search: search.toUpperCase(), occurance: values.trim().toUpperCase() === search.trim().toUpperCase() ? 1 : 0 } };
            }
        } else {
            return { status: 404, data: { message: `Parameter 'search' is undefined` } };
        }
    } else {
        return { status: 404, data: { message: `Parameter 'values' is undefined` } };
    }
}

const swap = (x, y) => {

    // Simple way to Approch need parse float or int
    // x+=y;  //x=x+y;
    // y=x-y;
    // x-=y; //x=x-y;

    // Best Approach ES6

    [x, y] = [y, x];
    return { x, y };
}


const isExist = (x, arr) => {
    let i = arr.length == 1 ? 0 : arr.length % 2 == 0 ? arr.length / 2 : (arr.length + 1) / 2;

    if (arr[i] == x) {
        return true;
    }

    if (i != 0 && arr[i] > x) {
        return isExist(x, [...arr].splice(0, i));
    }

    if (i != 0 && arr[i] < x) {
        return isExist(x, [...arr].splice(i, arr.length));
    }

    return false;
};

module.exports = { getMin, getMax, getAverage, getSortArray, getOccurance, swap, isExist };