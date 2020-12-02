const isTag = (str) => /<[^>]*>/g.test(str);
const withinFontFaceSet = (str) => /^[0-9a-zA-Z.]+$/g.test(str);
const maxSnowflakes = 200;

// Validate all input fields
$$('input').forEach(item => {
  item.addEventListener('input', (e) => validate());
});

// Validate
const validate = () => {
  let errors = 0;
  errors += $('input.letters').value ? 0 : 1;
  errors += $('input.quantity').value ? 0 : 1;
  if (errors > 0) {
    toggleButtons('add');
    return;
  }
  toggleButtons('remove');
  $('.btn.start').href = getQueryString();
  $('input.hidden.url').value = location.origin + getQueryString();
}

// Toggle disabled state of all buttons
const toggleButtons = (action) => {
  $$('.btn').forEach(item => {
    item.classList[action]('disabled');
  });
}


// Validate input for letters (a-z and 0-9)
$('input.letters').addEventListener('input', (e) => {
  const input = e.target.value;
  $('.display-text').textContent = input;
  if (isTag(input)) {
    e.target.value = '⚠️';
    return;
  }
  if (!withinFontFaceSet(input)) {
    const str = $('input.letters').value.slice(0,-1);
    $('.display-text').textContent = str;
    e.target.value = str;
    return;
  }
});

// Set the caret to the end of letters
$('input.letters').addEventListener('focus', (e) => {
  const input = e.target.value;
  e.target.value= '';
  e.target.value = input;
});

// Validate quantity input
$('input.quantity').addEventListener('input', (e) => {
  if (e.target.value > maxSnowflakes) e.target.value = maxSnowflakes;
  if (e.target.value < 1) e.target.value = '';
});

// Run toast message for settings copied
$('.btn.copy').addEventListener('click', (e) => {
  $('.toast-message').style.animationPlayState = 'running';
  $('.toast-message').classList.remove('none');
  $('input.hidden.url').select();
  document.execCommand('copy');
});

// Reset toast message for settings copied
$('.toast-message').addEventListener(animationEvent, (e) => {
  e.currentTarget.classList.add('none');
});

// Get query string for copy settings
const getQueryString = () => {
  const letters = encodeURIComponent($('input.letters').value);
  const quantity = encodeURIComponent($('input.quantity').value);
  const colour = encodeURIComponent($('input.colour').value);
  return `/snow?letters=${letters}&quantity=${quantity}&colour=${colour}`;
}

// Get fully encoded query string for share buttons
const getQueryStringEncoded = () => {
  const letters = $('input.letters').value;
  const quantity = $('input.quantity').value;
  const colour = encodeURIComponent($('input.colour').value);
  return encodeURIComponent(`${location.origin}/snow?letters=${letters}&quantity=${quantity}&colour=${colour}`);
}

// For url shortening
function getShortUrl(url) {
  return new Promise((resolve, reject) => {
    return fetch(url)
    .then(res => res.text())
    .then(data => {
      resolve(data);
    })
    .catch(err => {
      reject(err);
    });
  });
}

// Initialise
$('input.letters').focus();
$('.btn.start').href = getQueryString();
$('input.hidden.url').value = location.origin + getQueryString();

const sharing = {
  whatsapp: 'https://wa.me/?text=',
  facebook: 'https://www.facebook.com/sharer/sharer.php?text=hello&u=',
  twitter: 'https://twitter.com/intent/tweet?hashtags=node,express,pug,css&text=Check+out+the+Snow+Quotes+app+by+@rolandjlevy+-&url='
}

$('.btn.whatsapp').href = sharing['whatsapp'] + getQueryStringEncoded();
$('.btn.twitter').href = sharing['twitter'] + getQueryStringEncoded();
$('.btn.facebook').href = sharing['facebook'] + getQueryStringEncoded();