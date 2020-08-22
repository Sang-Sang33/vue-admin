let num: number = 122;
let sum: number = 222;
console.log(num + sum);
let arr: number[] = [1, 2, 3, 4, 5, 6, 45, 4, 3, 3, 4];
let newArr: number[] = arr.filter((item, index) => arr.indexOf(item) === index);
console.log(newArr);