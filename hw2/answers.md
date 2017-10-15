## Answers for HW2
**Question 1.1:**  
Looking at the page containing the table, what are the differences between the DOM as shown by the DOM inspector and the HTML source code? Why would you use the DOM inspector? When is the HTML source useful?  
**Answer 1.1**  
First of all, HTML source code shows an originally loaded pages, without any changes on the client side; in contrast, the DOM inspector displays the current state of tree - with ane changes on the client side.  
JS provides client side modifications, that's why we can not see our _table_ with looking at HTML source code, but can with looking at the DOM.

**Question 1.2:**  
Below we have partially reproduced the first lines from the table's dataset. What piece of software generates this table? Where are the original data stored?  
**Answer 1.2** 
D3, with some functions such as _append_, _html_ and et. al. In memory as a `__data__` attribute of elements.

**Question 2.1:** Would you filter other columns from the table the same way? E.g. would you use checkboxes or any other HTML widget?  
**Answer 2.1** Sure, I can, but I won't. ^_^ For instance, we can filter our table with specific range of population or life expectancy:  
``<input type="range" id="Life" value="60">`` 