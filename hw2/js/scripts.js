'use strict';
var quotesPath = "https://raw.githubusercontent.com/4skinSkywalker/Database-Quotes-JSON/master/quotes.json"
    //var quotesPath = 'https://www.w3schools.com/js/json_demo.txt'
var current_q = 0;
var quotes = [
    {
        "data": "“All successful men and women are big dreamers. They imagine what their future could be, ideal in every respect, and then they work every day toward their distant vision, that goal or purpose.”"
        , "author": "Brian Tracy"
    }
    , {
        "data": "“Nothing is impossible, the word itself says 'I'm possible'!”"
        , "author": "Audrey Hepburn"
    }
    , {
        "data": "“Paris is always a good idea”"
        , "author": "Audrey Hepburn"
    }
    , {
        "data": "“Having nothing, nothing can he lose”"
        , "author": "William Shakespeare"
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

function change_v2() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var data = JSON.parse(this.responseText);
            var tmp = Array.from({
                length: 5
            }, () => Math.floor(Math.random() * 4000));
            document.getElementById("quote").innerHTML = data[tmp[4]].quoteText;
            document.getElementById("author").innerHTML = data[tmp[4]].quoteAuthor;
            var q_list = document.getElementsByClassName("q_text");
            var a_list = document.getElementsByClassName("q_author");
            for (var t_t=0; t_t<4; t_t++) {
                q_list[t_t].innerHTML = data[tmp[t_t]].quoteText;
                a_list[t_t].innerHTML = data[tmp[t_t]].quoteAuthor;
            } 
        }
    };
    xhr.open("GET", quotesPath, true);
    xhr.send();
}

function change_v3() {
    document.getElementById("AuthorList").classList.toggle("show");
}

function sort_q() {
    var sort_me = [];
    var q_list = Array.from(document.getElementsByClassName("q_text"));
    var a_list = document.getElementsByClassName("q_author");
    // Build Dictionary here ->
    q_list.forEach((key, idx) => sort_me.push({"quote": key.innerHTML, "author":  a_list[idx].innerHTML}));
    // Sorting
    sort_me.sort(function (a, b) {
        if (a.quote > b.quote) {
            return 1;
        }
        else if (a.quote < b.quote) {
            return -1;
        }
        return 0;
    });
    var q_list = document.getElementsByClassName("q_text");
    var a_list = document.getElementsByClassName("q_author");
    for (var t_t=0; t_t<4; t_t++) {
                q_list[t_t].innerHTML = sort_me[t_t].quote
                a_list[t_t].innerHTML = sort_me[t_t].author;
            }
}
window.onclick = function (event) {
    if (!event.target.matches('.change-btn_V3')) {
        var dropdowns = document.getElementsByClassName("dropdown_content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}