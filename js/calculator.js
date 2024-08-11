'use strict';
const MAX_DECIMAL_LENGTH = 6;

const $display = $('.display');
const $keypad = $('.key-pad');

const reservedDigits = ['ERROR', 'INFINITY', 'NAN'];

const specialKeysValues = ['Enter', 'Backspace', 'Reset'];
const operators = {
  highPrecedence: ['+', '*', '/'],
  lowPrecedence: ['-'],
  all: ['+', '-', '*', '/'],
};

const validKeys = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '.',
  ...specialKeysValues,
  ...operators.all,
];

// * FUNCTIONS

const specialKeyHandler = (key) => {
  switch (key) {
    case 'Backspace':
      const prevNum = removeCommas($display.text());
      if (reservedDigits.includes(prevNum.toUpperCase())) {
        $display.text('');
        return;
      }
      $display.text(addCommas(prevNum.slice(0, prevNum.length - 1)));
      break;

    case 'Reset':
      $display.text('');
      break;

    case 'Enter':
      let num = removeCommas($display.text());
      if (num.length === 0) return;
      try {
        const lastDigit = num[num.length - 1];
        if (operators.all.includes(lastDigit)) num = num.slice(0, -1);
        $display.text(addCommas(fixDecimalLength(eval(num))));
      } catch (e) {
        console.error(e.message);
        $display.text('error');
      }
      break;
  }
};

const fixDecimalLength = (num) => {
  const noOfDecimals = `${num}`.split('.').length - 1;
  if (!noOfDecimals) return num;
  return num.toFixed(MAX_DECIMAL_LENGTH);
};

// FORMATTING FUNCTIONS
const printNum = (numStr) => {
  const prevNum = removeCommas($display.text());
  const lastDigit = prevNum[prevNum.length - 1];

  // Get the current segment (after the last operator)
  const segments = prevNum.split(/[+\-*/]/);
  const currentSegment = segments[segments.length - 1];

  // Prevent multiple decimal points in the same number segment
  if (numStr === '.' && currentSegment.includes('.')) {
    return;
  }

  // When to skip inserting the digit
  if (
    (!lastDigit && operators.highPrecedence.includes(numStr)) ||
    (operators.all.includes(lastDigit) &&
      operators.all.includes(numStr) &&
      lastDigit === numStr)
  ) {
    return;
  }

  // When to replace the operator
  if (
    operators.all.includes(lastDigit) &&
    operators.highPrecedence.includes(numStr)
  ) {
    $display.text(`${prevNum.slice(0, -1)}${numStr}`);
    return;
  }

  // If you try to add text after INFINITY, NAN, or ERROR
  if (reservedDigits.includes(prevNum.toUpperCase())) {
    $display.text(numStr);
    return;
  }

  // Add the new number or operator to the display
  $display.text(addCommas(prevNum + numStr));
};

// SMALL FUNCTIONS
// http://www.mredkj.com/javascript/nfbasic.html
const addCommas = (numStr) => {
  numStr += '';
  let x = numStr.split('.');
  let x1 = x[0];
  let x2 = x.length > 1 ? '.' + x[1] : '';
  let rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }
  return x1 + x2;
};

const removeCommas = (numStr) => numStr.replaceAll(',', '');

const animateKey = (key) => {
  key.classList.add('pressed');
  setTimeout(() => {
    key.classList.remove('pressed');
  }, 100);
};

// * EVENT LISTENERS

$keypad.click((e) => {
  const keyClicked = e.target;
  const keyClickedClass = Array.from(keyClicked.classList);

  if (!keyClickedClass.includes('key-pad')) {
    animateKey(keyClicked);

    const keyValue = keyClicked.id;

    if (specialKeysValues.includes(keyValue)) {
      specialKeyHandler(keyValue);
      return;
    }

    printNum(keyValue);
  }
});

$(document).keydown((e) => {
  if (validKeys.includes(e.key)) {
    animateKey(document.getElementById(e.key));
    if (specialKeysValues.includes(e.key)) {
      specialKeyHandler(e.key);
      return;
    }

    printNum(e.key);
  }

  if (e.ctrlKey && e.key === 'z') {
    animateKey(document.getElementById('Reset'));
    specialKeyHandler('Reset');
  }
});
