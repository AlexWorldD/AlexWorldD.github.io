'use strict';
var current_q = 0;
var quotes = [
    {
        "data": "All successful men and women are big dreamers. They imagine what their future could be, ideal in every respect, and then they work every day toward their distant vision, that goal or purpose.”"
        , "author": "Brian Tracy"
    }
    , {
        "data": "Nothing is impossible, the word itself says 'I'm possible'!”"
        , "author": "Audrey Hepburn"
    }
    , {
        "data": "Paris is always a good idea”"
        , "author": "Audrey Hepburn"
    }];

function change() {
    var tmp = Math.floor(Math.random() * quotes.length);
    while (current_q === tmp) {
        tmp = Math.floor(Math.random() * quotes.length);
    }
    document.getElementById("quote").innerHTML = quotes[tmp].data;
    document.getElementById("author").innerHTML = quotes[tmp].author;
    current_q = tmp;
}