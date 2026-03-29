/* Project Standards:
  - Logging standards
  - Naming standards
    function, method, variable => CAMEL case     goHome
    class => PASCAL                              Member class
    folder, file => KEBAB
    css => SNAKE                                 button_style
 
  - Error handling

 */

/* Request:
  Traditional Api (form POST)
  Rest Api
  GraphQL
  ...
 */

/* Frontend Development:
  Traditional FD => BSSR (Admin)=> EJS
  Modern FD      => SPA  (User's Application)=> REACT
*/

/* Cookies :
request json(JavaScript Object Notation)
self destroy
*/

/* Validation :
 Frontend Validation| 
 Backend Validation| Module ichida shartga to'g'ri kelmasa
 Database Validation| > Databasedagi talabga to'g'ri kelmasa
*/

// MIT TASK
/*
TASK ZI

Shundan function yozing, bu function 3 soniydan so'ng
"Hello World!" so'zini qaytarsin.

MASALAN: delayHelloWorld("Hello World"); return "Hello World";
 */
/*Masalani yechimi */
function delayHelloWorld(msg: string): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(msg);
    }, 3000);
  });
}

delayHelloWorld("Hello World").then((res) => {
  console.log(res);
});

/*
TASK-ZH:

Shunday function yozing, u berilgan array parametrni ichidagi 
eng katta raqamgacha tushib qolgan raqamlarni bir arrayda qaytarsin. 
MASALAN: findDisappearedNumbers([1, 3, 4, 7]) return [2, 5, 6]
*/
/* Masalani yechimi
function findDisappearedNumbers(arr: number[]) {
  let result = [];

  let max = Math.max(...arr);

  for (let i = 1; i <= max; i++) {
    if (!arr.includes(i)) {
      result.push(i);
    }
  }

  return result;
}

console.log(findDisappearedNumbers([1, 3, 4, 7]));
console.log(findDisappearedNumbers([2, 4, 6, 8, 10]));
console.log(findDisappearedNumbers([3, 4, 7, 11]));
*/
/*
TASK-ZG:

Shunday function yozing, u berilgan string parametrni snake casega otkazib qaytarsin. 
MASALAN: capitalizeWords('name should be a string') return 'name_should_be_a_string'
*/
/* Masalani yechimi 
function toSnakeCase(str: string) {
  return str.toLowerCase().split(" ").join("_");
}

console.log(toSnakeCase("name should be a string"));
console.log(toSnakeCase("Hello World"));
console.log(toSnakeCase("snake casega otkazildi ."));
*/
/*
TASK-ZF:

Shunday function yozing, uni string parametri bolsin. 
String ichidagi har bir sozni bosh harflarini katta 
harf qilib qaytarsin lekin 1 yoki 2 harfdan iborat sozlarni esa oz holicha qoldirsin.
MASALAN: capitalizeWords('name should be a string') return 'Name Should be a String'
*/
/* Masalani yechimi 

function capitalizeWords(str: string) {
  return str
    .split(" ")
    .map((word) => {
      if (word.length <= 2) {
        return word; // o‘zgarmaydi
      }
      return word[0].toUpperCase() + word.slice(1);
    })
    .join(" ");
}

console.log(capitalizeWords("name should be a string"));
console.log(capitalizeWords("i am a developer"));
console.log(capitalizeWords("hello a teacher"));
*/
/*
TASK ZE:

Shunday function yozing, uni  string parametri bolsin. 
String ichida takrorlangan harflarni olib tashlab qolganini qaytarsin
MASALAN: removeDuplicate('stringg') return 'string'
*/
/* Masalani yechimi 
function removeDuplicate(str: string) {
  let result = "";

  for (let i = 0; i < str.length; i++) {
    if (!result.includes(str[i])) {
      result += str[i];
    }
  }

  return result;
}

console.log(removeDuplicate("stringg"));
console.log(removeDuplicate("hello"));
console.log(removeDuplicate("aaabbbccc"));
*/
/*
TASK ZD

Shunday function yozing. Bu function o'ziga, parametr sifatida
birinchi oddiy number, keyin yagona array va uchinchi bo'lib oddiy number
qabul qilsin. Berilgan birinchi number parametr, arrayning tarkibida 
indeks bo'yicha hisoblanib, shu aniqlangan indeksni uchinchi number 
parametr bilan alashtirib, natija sifatida
yangilangan arrayni qaytarsin.

MASALAN: changeNumberInArray(1, [1,3,7,2], 2) return [1,2,7,2];

Yuqoridagi misolda, birinchi raqam bu '1' va arrayning '1'chi indeksi bu 3.
Bizning function uchinchi berilgan '2' raqamini shu '3' bilan almashtirib,
yangilangan arrayni qaytarmoqda.
*/
/* Masalani yechimi 
function changeNumberInArray(
  index: number,
  arr: Array<number>,
  newNumber: number,
) {
  arr[index] = newNumber;
  return arr;
}

console.log(changeNumberInArray(1, [1, 3, 7, 2], 2));
console.log(changeNumberInArray(3, [1, 3, 7, 2], 4));
console.log(changeNumberInArray(0, [5, 8, 9], 10));
console.log(changeNumberInArray(2, [4, 6, 1, 3], 99));
*/

/*
TASK ZC

Selisy (°C) shkalasi bo'yicha raqam qabul qilib, uni
Ferenhayt (°F) shkalisaga o'zgaritib beradigan function yozing.

MASALAN: celsiusToFahrenheit(0) return 32;
MASALAN: celsiusToFahrenheit(10) return 50;

Yuqoridagi misolda, 0°C, 32°F'ga teng.
Yoki 10 gradus Selsiy, 50 Farenhaytga teng.

°C va °F => Tempraturani o'lchashda ishlatiladigan o'lchov birligi.
*/
/* Masalani yechimi 
function celsiusToFahrenheit(celsius: number) {
  //F = C \times \frac{9}{5} + 32, (C * 9) / 5 + 32 = F
  //C = (F - 32) \times \frac{5}{9}, ((F - 32) * 5) / 9 = C
  return (celsius * 9) / 5 + 32;
}

console.log(celsiusToFahrenheit(0));
console.log(celsiusToFahrenheit(6));
console.log(celsiusToFahrenheit(10));
console.log(celsiusToFahrenheit(20));
console.log(celsiusToFahrenheit(22));
*/
/*
TASK-ZB:

Shunday function yozing, uni 2 ta number parametri bolsin 
va berilgan sonlar orasidan random raqam return qilsin

MASALAN: randomBetween(30, 50) return 45
*/
/* Masalani yechimi 

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

console.log(randomBetween(30, 50));
console.log(randomBetween(30, 50));
console.log(randomBetween(20, 50));
console.log(randomBetween(30, 40));
*/

/*
TASK Z

Shunday function yozing. Bu function sonlardan iborat array
qabul qilsin. Function'ning vazifasi array tarkibidagi juft
sonlarni topib ularni yig'disini qaytarsin.

MASALAN:
sumEvens([1, 2, 3]); return 2;
sumEvens([1, 2, 3, 2]); return 4;

Yuqoridagi misolda, bizning funktsiya
berilayotgan array tarkibidagi sonlar ichidan faqatgina juft bo'lgan
sonlarni topib, ularni hisoblab yig'indisini qaytarmoqda.
*/
/* Masalani yechimi 

function sumEvens(arr: number[]): number {
  let sum = 0;

  for (const num of arr) {
    if (num % 2 === 0) {
      sum += num;
    }
  }

  return sum;
}

console.log(sumEvens([1, 2, 3]));
console.log(sumEvens([1, 2, 3, 2]));
console.log(sumEvens([2, 4, 6]));
console.log(sumEvens([1, 3, 5]));
*/
/*
TASK Y

Shunday function yozing, uni 2'ta array parametri bo'lsin.
Bu function ikkala arrayda ham ishtirok etgan bir xil
qiymatlarni yagona arrayga joylab qaytarsin.

MASALAN: findIntersection([1,2,3], [3,2,0]) return [2,3]

Yuqoridagi misolda, argument sifatida berilayotgan array'larda
o'xshash sonlar mavjud. Function'ning vazifasi esa ana shu
ikkala array'da ishtirok etgan o'xshash sonlarni yagona arrayga
joylab return qilmoqda.
 */
/* Masalani yechimi 

function findIntersection(arr1: number[], arr2: number[]) {
  const result: number[] = [];

  for (let i = 0; i < arr1.length; i++) {
    if (arr2.includes(arr1[i]) && !result.includes(arr1[i])) {
      result.push(arr1[i]);
    }
  }

  return result;
}

console.log(findIntersection([1, 2, 3], [3, 2, 0]));
console.log(findIntersection([5, 6], [1, 2]));
console.log(findIntersection([1, 2, 2, 3, 5, 0], [2, 3, 4, 5, 0]));
*/
/*
TASK X

Shunday function yozing, uni object va string parametrlari bo'lsin.
Bu function, birinchi object parametri tarkibida, kalit sifatida ikkinchi string parametri
necha marotaba takrorlanganlini sanab qaytarsin.

Eslatma => Nested object'lar ham sanalsin

MASALAN: countOccurrences({model: 'Bugatti', steer: {model: 'HANKOOK', size: 30}}, 'model') return 2

Yuqoridagi misolda, birinchi argument object, ikkinchi argument 'model'.
Funktsiya, shu ikkinchi argument 'model', birinchi argument object
tarkibida kalit sifatida 2 marotaba takrorlanganligi uchun 2 soni return qilmoqda
*/
/* Masalani yechimi 

function countOccurrences(obj: any, key: string): number {
  if (obj === null || typeof obj !== "object") return 0;

  let count = 0;

  for (const k in obj) {
    if (k === key) count++;
    count += countOccurrences(obj[k], key);
  }

  return count;
}

console.log(
  countOccurrences(
    {
      model: "BMW",
      items: [{ model: "Audi" }, { model: "Mercedes" }],
    },
    "model",
  ),
);
console.log(
  countOccurrences(
    {
      features: [
        {
          features: {
            model: "Autopilot",
          },
        },
        {
          model: "Performance",
        },
      ],
    },
    "features",
  ),
);
*/
/*
TASK W

Shunday function yozing, u o'ziga parametr sifatida
yagona array va number qabul qilsin. Siz tuzgan function
arrayni numberda berilgan uzunlikda kesib bo'laklarga
ajratgan holatida qaytarsin.
MASALAN: chunkArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3);
return [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]];

Yuqoridagi namunada berilayotgan array ikkinchi parametr 3'ga
asoslanib 3 bo'lakga bo'linib qaytmoqda. Qolgani esa o'z holati qolyapti
*/
/* Masalani yechimi
 
function chunkArray(arr: any[], size: number) {
  const result = [];

  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }

  return result;
}

console.log(chunkArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3));
console.log(chunkArray(["a", "b", "c", "d", "e"], 2));
console.log(chunkArray([1, 2, 3], 1));
console.log(chunkArray([1, 2, 3, 4, 5], 4));
console.log(chunkArray(["x", "y", "z"], 2));
console.log(chunkArray([1], 1));
console.log(chunkArray([1, 2, 3, 4], 2));
*/
/*
TASK V

Shunday function yozing, uni string parametri bo'lsin.
Va bu function stringdagi har bir harfni o'zi bilan
necha marotaba taktorlanganligini ko'rsatuvchi object qaytarsin.
  
MASALAN: countChars("hello") return {h: 1, e: 1, l: 2, o: 1}

Yuqoridagi misolda, 'hello' so'zi tarkibida
qatnashgan harflar necha marotaba takrorlangini bilan
object sifatida qaytarilmoqda.
*/
/**Masalani yechimi

function countChars(word: string) {
  const result: { [key: string]: number } = {};

  for (const char of word) {
    if (result[char]) {
      result[char] += 1;
    } else {
      result[char] = 1;
    }
  }

  return result;
}

console.log(countChars("hello"));
console.log(countChars("aaa"));
console.log(countChars("abc"));
console.log(countChars("shokhrukh"));
 **/

/*
TASK U

Shunday function tuzing, uni number parametri bo'lsin.
Va bu function berilgan parametrgacha, 0'dan boshlab
oraliqda nechta toq sonlar borligini aniqlab return qilsi.

MASALAN: sumOdds(9) return 4; sumOdds(11) return 5;

Yuqoridagi birinchi misolda, argument sifatida, 9 berilmoqda.
Va 0'dan boshlab sanaganda 9'gacha 4'ta toq son mavjud. 
Keyingi namunada ham xuddi shunday xolat takrorlanmoqda.
*/
/**Masalani yechimi 
 
function sumOdds(number: any) {
  let count = 0;

  for (let i = 0; i < number; i++) {
    if (i % 2 !== 0) {
      count++;
    }
  }

  // return num%2 ===1 ? (num/2)-0.5 : num/2
  // return Math.floor(num/2);

  return count;
}

console.log(sumOdds(9));
console.log(sumOdds(11));
console.log(sumOdds(17));
console.log(sumOdds(23));
*/

/*
TASK T

Shunday function tuzing, u sonlardan tashkil topgan 2'ta array qabul qilsin.
Va ikkala arraydagi sonlarni tartiblab bir arrayda qaytarsin.

MASALAN: mergeSortedArrays([0, 3, 4, 31], [4, 6, 30]); return [0, 3, 4, 4, 6, 30, 31];

Yuqoridagi misolda, ikkala arrayni birlashtirib, tartib raqam bo'yicha tartiblab qaytarmoqda.
*/
/*Masalani yechimi
 
function mergeSortedArrays(arr1: number[], arr2: number[]) {
  const result = [];

  let i = 0;
  let j = 0;

  while (i < arr1.length && j < arr2.length) {
    if (arr1[i] < arr2[j]) {
      result.push(arr1[i]);
      i++;
    } else {
      result.push(arr2[j]);
      j++;
    }
  }

  while (i < arr1.length) {
    result.push(arr1[i]);
    i++;
  }

  while (j < arr2.length) {
    result.push(arr2[j]);
    j++;
  }

  return result;
}

console.log(mergeSortedArrays([0, 3, 4, 31], [4, 6, 30]));
console.log(mergeSortedArrays([1, 2, 3], [4, 5, 6]));
console.log(mergeSortedArrays([5, 10, 15], [2, 3, 20]));
*/

/*
TASK-S:

Shunday function yozing, u numberlardan tashkil topgan array
qabul qilsin va osha numberlar orasidagi tushib qolgan sonni topib uni return qilsin
MASALAN: missingNumber([3, 0, 1]) return 2

*/

/*Masalani yechimi

function missingNumber(nums: number[]) {
  const sum = Math.max(...nums);

  const result = [];

  for (let i = 0; i <= sum; i++) {
    if (!nums.includes(i)) {
      result.push(i);
    }
  }

  return result;

  // const n = nums.length;
  // const sum = (n * (n + 1)) / 2;
  // let sumNum = 0;
  // for (let i = 0; i < nums.length; i++) {
  //   sumNum += nums[i];
  // }
  // return sum - sumNum;
}

console.log(missingNumber([3, 0, 1]));
console.log(missingNumber([0, 1, 5, 7, 9]));
console.log(missingNumber([1]));
console.log(missingNumber([9, 6, 4, 2, 3, 7, 0, 1]));
console.log(missingNumber([0]));
*/

/*
TASK R

Shunday function yozing, u string parametrga ega bo'lsin.
Agar argument sifatida berilayotgan string, "1 + 2" bo'lsa,
string ichidagi sonlarin yig'indisni hisoblab, number holatida qaytarsin

MASALAN: calculate("1 + 3"); return 4;
1 + 3 = 4, shu sababli 4 natijani qaytarmoqda.
*/
/*Masalami yechimi:


function calculate(a: string) {
  const parts = a.split(/([+\-/])/);
  console.log(a, "=");
  const num1 = Number(parts[0]);
  const operator = parts[1];
  const num2 = Number(parts[2]);

  switch (operator) {
    case "+":
      return num1 + num2;
    case "-":
      return num1 - num2;
    case "*":
      return num1 * num2;
    case "/":
      return num1 / num2;
    default:
      return "Invalid operator";
  }
}

console.log(calculate("100*5"));
console.log(calculate("99 - 44"));
console.log(calculate("10/2"));
console.log(calculate("10 + 5"));
*/

/*
TASK Q:

Shunday function yozing, u 2 ta parametrga ega bo'lib
birinchisi object, ikkinchisi string bo'lsin.
Agar qabul qilinayotgan ikkinchi string, objectning
biror bir propertysiga mos kelsa, 'true', aks holda mos kelmasa 'false' qaytarsin.

MASALAN: hasProperty({ name: "BMW", model: "M3" }, "model"); return true;
Ushbu misolda, 'model' string, objectning propertysiga mos kelganligi uchun 'true' natijani qaytarmoqda
*/
/* Masalani yechimi:

function hasProperty(obj: object, key: string): boolean {
  return key in obj;
}

console.log(hasProperty({ name: "BMW", model: "M3" }, "model")); // true
console.log(hasProperty({ name: "BMW", model: "M3" }, "year")); // false
 */

/*
TASK P:

Parametr sifatida yagona object qabul qiladigan function yozing.
Qabul qilingan objectni nested array sifatida convert qilib qaytarsin

MASALAN: objectToArray( {a: 10, b: 20}) return [['a', 10], ['b', 20]]
*/
/* Masalani yechimi:
 
function objectToArray(obj: any) {
  let result = [];

  for (let key in obj) {
    result.push([key, obj[key]]);
  }

  return result;
}

console.log(objectToArray({ a: 10, b: 20 }));
console.log(objectToArray({ name: "Ali", age: 25, Student: true }));
*/

/*
TASK O:

Shunday function yozing va u har xil qiymatlardan iborat array qabul qilsin.
Va array ichidagi sonlar yig'indisini hisoblab chiqgan javobni qaytarsin

MASALAN: calculateSumOfNumbers([10, "10", {son: 10}, true, 35]); return 45

Yuqoridagi misolda array tarkibida faqatgina ikkita yagona son mavjud bular 10 hamda 35
Qolganlari nested bo'lib yoki type'lari number emas.
*/
/* Masalani yechimi:
 
function calculateSumOfNumbers(value: any[]) {
  let num = 0;

  for (let i = 0; i < value.length; i++) {
    if (typeof value[i] === "number") {
      num = num + value[i];
    }
  }
  return num;
}

console.log(calculateSumOfNumbers([10, "10", { son: 10 }, true, 35]));
console.log(calculateSumOfNumbers([1, 2, 3, 4, 5]));
console.log(calculateSumOfNumbers(["a", true, {}, null, undefined]));
console.log(calculateSumOfNumbers([100, "50", false, 20, { price: 30 }, 5]));
*/
/*
TASK N:

Shunday function yozing, u string qabul qilsin va string palindrom 
yani togri oqilganda ham, orqasidan oqilganda ham bir hil oqiladigan 
soz ekanligini aniqlab boolean qiymat qaytarsin.

MASALAN: palindromCheck("dad") return true;  palindromCheck("son") return false;
*/
/* Masalani yechimi:

function palindromCheck(simpword: string) {
  let reverseword = simpword.split("").reverse().join("");

  return simpword === reverseword;
}

console.log(palindromCheck("dad"));
console.log(palindromCheck("son"));
console.log(palindromCheck("level"));
console.log(palindromCheck("apple"));
*/
/*
TASK M: 

Shunday function yozing, u raqamlardan tashkil topgan array qabul qilsin va
array ichidagi har bir raqam uchun raqamni ozi va hamda osha raqamni kvadratidan
tashkil topgan object hosil qilib, hosil bolgan objectlarni array ichida qaytarsin.
MASALAN: getSquareNumbers([1, 2, 3]) return [{number: 1, square: 1}, {number: 2, square: 4}, 
{number: 3, square: 9}];
*/
/*Masalani yechimi:

// function getSquareNumbers(arr: number[]) {
//   return arr.map((num) => {
//     return {
//       number: num,
//       square: num * num,
//     };
//   });
// }
// console.log(getSquareNumbers([1, 2, 3]));

function getSquareNumbers(arr: number[]) {
  let result = [];

  for (let i = 0; i < arr.length; i++) {
    result.push({
      number: arr[i],
      square: arr[i] * arr[i],
    });
  }

  return result;
}

console.log(getSquareNumbers([0, 1, 2, 3]));
console.log(getSquareNumbers([4, -5, 6]));
console.log(getSquareNumbers([7, 8, -9]));
*/
/*
TASK L: 

Shunday function yozing, u string qabul qilsin va 
string ichidagi hamma sozlarni chappasiga yozib va 
sozlar ketma-ketligini buzmasdan stringni qaytarsin.
MASALAN: reverseSentence("we like coding!") return "ew ekil gnidoc";
*/
/*Masalani yechimi:
function reverseSentence(gap: string) {
  let sozlar = gap.split(" ");

  let teskarigap = sozlar.map((word) => {
    return word.split("").reverse().join("");
  });

  // return teskarigap.join(" ");

  return console.log(teskarigap.join(" "));
}
// console.log(reverseSentence("we like coding!"));
reverseSentence("we like coding!");
reverseSentence("hello world");
reverseSentence("Telefon butkasi!");
reverseSentence("aziza kiyik");
*/
/*
TASK K: 

Shunday function yozing, u string qabul qilsin va string ichidagi unli harflar sonini qaytarsin.
MASALAN: countVowels("string") return 1;
*/
/*Masalani yechimi:
 
function countVowels(harflar: string) {
  // : number
  let soni = 0;
  let harf = "";
  const unlilar = "aeiou";

  harflar = harflar.toLowerCase();

  for (let i = 0; i < harflar.length; i++) {
    if (unlilar.includes(harflar[i])) {
      soni++;
      harf += harflar[i];
    }
  }

  return console.log(soni, harf);
  // return { soni, harf };
}

countVowels("Uzbekistan");
countVowels("string");
countVowels("Apple");
*/

/*
TASK J:

Shunday function tuzing, u string qabul qilsin.
Va string ichidagi eng uzun so'zni qaytarsin.

MASALAN: findLongestWord("I came from Uzbekistan!"); return "Uzbekistan!"

Yuqoridagi text tarkibida 'Uzbekistan'
eng uzun so'z bo'lganligi uchun 'Uzbekistan'ni qaytarmoqda
*/
/* Masalani yachimi:

function findLongestWord(a: string) {
  let b = "";
  const c = a.split(" ");

  for (let i = 0; i < c.length; i++) {
    if (c[i].length > b.length) {
      b = c[i];
    }
  }
  return b;
}

console.log(findLongestWord("I came from Uzbekistan!"));
console.log(findLongestWord("My name is Shoxruh!"));
*/
/*
TASK-I:

Shunday function tuzing, u parametrdagi array ichida eng ko'p
takrorlangan raqamni topib qaytarsin.

MASALAN: majorityElement([1, 2, 3, 4, 5, 4, 3, 4]); return 4

Yuqoridag misolda argument sifatida kiritilayotgan array 
tarkibida 4 soni ko'p takrorlanganligi uchun 4'ni return qilmoqda.
*/
/* Masalani yachimi:
 
function majorityElement(arr: number[]): number {
  const count: any = {};

  for (let num of arr) {
    if (count[num]) {
      count[num]++;
    } else {
      count[num] = 1;
    }
  }

  let maxCount = 0;
  let result = arr[0];

  for (let key in count) {
    if (count[key] > maxCount) {
      maxCount = count[key];
      result = Number(key);
    }
  }

  return result;
}

console.log(majorityElement([1, 2, 3, 4, 5, 4, 3, 4]));
console.log(majorityElement([1, 2, 7, 8, 6, 7, 4, 7]));
*/

/*
TASK H2: 

Shunday function tuzing, unga string argument pass bolsin. Function ushbu agrumentdagi digitlarni yangi stringda return qilsin

MASALAN: getDigits("m14i1t") return qiladi "141"
 */
/* Masalani yachimi:
// function getDigits(a: string) {
//   return a
//     .split("")
//     .filter((ch) => ch >= "0" && ch <= "9")
//     .join("");
// }
function getDigits(a: string) {
  let b = "";
  for (let i = 0; i < a.length; i++) {
    if (a[i] >= "0" && a[i] <= "9") {
      b += a[i];
    }
  }
  return b;
}

console.log(getDigits("m14i1t"));
console.log(getDigits("J34a8c97k"));
console.log(getDigits("q1w2e3r4t5y6"));
*/
/*
TASK H: 

Shunday function tuzing, u integerlardan iborat arrayni argument sifatida qabul qilib,
faqat positive qiymatlarni olib string holatda return qilsin

 MASALAN: getPositive([1, -4, 2]) return qiladi "12"
*/
/* Masalani yachimi:

// function getPositive(a: number[]): string {
//   return a.filter((num) => num > 0).join("");
// }

function getPositive(a: number[]): string {
  let b = "";
  for (let i = 0; i < a.length; i++) {
    if (a[i] >= 0) {
      b += a[i];
    }
  }
  return b;
}

console.log(getPositive([1, -4, 2, 0]));
console.log(getPositive([-5, 7, 7]));
console.log(getPositive([8, -8, 8]));

console.log("Hello World");
*/
