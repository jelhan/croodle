var outerContainer = document.createElement('div');
outerContainer.style.display = 'flex';
outerContainer.style.height = '100vh';

var container = document.createElement('div');
container.style.alignSelf = 'center';
container.style.margin = 'auto';
container.style.maxWidth = '50rem';
container.style.textAlign = 'center';
outerContainer.appendChild(container);

var header = document.createElement('h2');
header.style.color = '#B33A3A';

var icon = document.createElement('span');
icon.className = 'oi oi-warning';
header.appendChild(icon);
header.appendChild(document.createTextNode('Your Browser is not supported!'));
header.appendChild(icon.cloneNode());
container.appendChild(header);

var text = document.createElement('p');
text.innerText =
  'You are using an out-dated browser like Internet Explorer 11 that is not supported anymore by Croodle. ' +
  'Please switch to a modern browser like Firefox, Google Chrome, Microsoft Edge or Safari.';
container.appendChild(text);

document.body.appendChild(outerContainer);
