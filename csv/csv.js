const fs = require('fs');

const input = fs.readFileSync('input.csv', 'utf8');

//Convert the input file into an array of objects
let inputArray = input.trim().split('\n').slice(1).map(line => {
    const [product_code, quantity, pick_location] = line.split(',');
    return { product_code, quantity: Number(quantity), pick_location };
});

//Group the lines by product code and sum the quantities
let groupedArray = inputArray.reduce((acc, curr) => {
    const index = acc.findIndex(item => item.product_code === curr.product_code);
    if (index === -1) {
      acc.push(curr);
    } else {
      acc[index].quantity += curr.quantity;
    }
    return acc;
}, []);

//The localeCompare() method returns a number indicating whether a reference string comes before, or after
const pickLocationComparator = (a, b) => a.pick_location.localeCompare(b.pick_location);
groupedArray.reduce((prev, current) => pickLocationComparator(prev, current) > 0 ? prev : current);

groupedArray.sort((a, b) => {
    return a.pick_location.localeCompare(b.pick_location);
});

//Convert array of objects back to a CSV file
const output = `product_code,quantity,pick_location\n${groupedArray.map(item => `${item.product_code},${item.quantity},${item.pick_location}`).join('\n')}`;

//Write the output file
fs.writeFileSync('output.csv', output);
