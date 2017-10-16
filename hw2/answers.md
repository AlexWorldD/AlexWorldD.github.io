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

**Question 3.1:** Could you aggregate the table using other columns? If you think yes, explain which ones and how you would group values. Which HTML widgets would be appropriate?  
**Answer 3.1** In my view there are _zeroreason_ for another aggregation. Meanwhile, sometimes could be helpful sub-aggregation, for example, via GDP/Population: Low, Medium and High which allows us to see the changes between different amount of $/person. For example, for High is obviously the high Life Expectancy...

**Question 4.1** What does the new attribute _years_ hold?  
**Answer 4.1** Arrays of data for specific year for selected country. 
```sh
"years": [
              {
                  "gdp": 12650000000.0,
                  "life_expectancy": 42.0514634146341,
                  "year": 1995,  
                  "population": 12104952.0
                              }, ...] 
```
**Question 5.1** What are the pros and cons of using HTML vs. SVG? Give some examples in the context of creating visualizations.  
**Answer 5.1** 