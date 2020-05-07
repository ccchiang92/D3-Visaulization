button.on('click', function() {
    var inputElement = d3.select(html_element);
    var inputValue = inputElement.property('value');
    d3.select('h1>span').text(inputValue);
});