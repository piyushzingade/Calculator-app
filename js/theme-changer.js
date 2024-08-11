const themes = {
  '!': 'theme-1',
  '@': 'theme-2',
  '#': 'theme-3',
};

const getBtnNum = (str) => {
  return str.slice(-1);
};

const themeChanger = (newClass) => {
  const oldClass = $('body').attr('class');

  // hide theme btns
  $(`.theme-btn-${getBtnNum(oldClass)}`).removeClass('show');
  $(`.theme-btn-${getBtnNum(newClass)}`).addClass('show');

  // change theme of the page
  $('body').removeClass(oldClass);
  $('body').addClass(newClass);
};

$(document).keypress((e) => {
  if (e.key in themes) {
    themeChanger(themes[e.key]);
  }
});

$('.theme-btns').click(function () {
  themeChanger($(this).attr('id'));
});
