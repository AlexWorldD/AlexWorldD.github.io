'use strict';
CustomEvent
var current_q = 0;
var quotes = [
    "All successful men and women are big dreamers. They imagine what their future could be, ideal in every respect, and then they work every day toward their distant vision, that goal or purpose.” – Brian Tracy"
    , "Nothing is impossible, the word itself says 'I'm possible'!” – Audrey Hepburn"
    , "Paris is always a good idea” – Audrey Hepburn"];

function change() {
    var tmp = Math.floor(Math.random() * quotes.length);
    while (current_q == tmp) {
        tmp = Math.floor(Math.random() * quotes.length);
    }
    document.getElementById("quote").innerHTML = quotes[tmp];
    current_q = tmp;
}