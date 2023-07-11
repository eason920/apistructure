export const round3 = (num) => {
  // console.log('num is ', num);
  if (num !== '*' && num !== '?') {
    const bIsFloatNum = /\./.test(num);
    if (bIsFloatNum) {
      let result = Math.round(Number(num) * 100) / 100;
      const length = String(String(result).split('.')[1]).length;
      if (length < 3) {
        let zeroString = '';
        switch (length) {
          case 1:
            zeroString = '00';
            break;
          case 2:
            zeroString = '0';
            break;
          default:
        }
        result = String(result) + zeroString;
      }
      return result;
    } else {
      return num + '.000';
    }
  } else {
    return num;
  }
};

export const negativeToPostive = (num) => {
  if (num !== '*') {
    return Number(String(num).replace('-', ''));
  } else {
    return num;
  }
};
