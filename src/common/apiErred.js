export const apiErred = () => {
  const bApiErrored = window.localStorage.getItem('apiErred');
  console.log("window.localStorage.getItem('apiErred') is", bApiErrored);
  console.log('bApiErrored === null?', bApiErrored === null);
  console.log('bApiErrored?', bApiErrored);
  if (bApiErrored === null || bApiErrored === 'false') {
    window.localStorage.setItem('apiErred', 'true');
    location.reload();
  } else {
    location.href = '/home';
  }
};
