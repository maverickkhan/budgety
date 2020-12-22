var budgetController = (function() {
    // some code
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentages = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentages = function() {
        return this.percentage;
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var calculateTotal = function(type) {
        var sum = 0;
        data.allItem[type].forEach(function(cur) {
            sum += cur.value;
        });
        data.totals[type] = sum;
    };

    var data = {
        allItem: {
            exp: [],
            inc: [],
        },
        totals: {
            exp: 0,
            inc: 0,
        },
        budget: 0,
        percentage: -1,
    }
    return {
        addItem: function(type, des, val) {
            var ID, newItem;
            //Create new ID
            if (ID = data.allItem[type].length > 0) {
                ID = data.allItem[type][data.allItem[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            //Create new Item
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            //Pushing new item into all items
            data.allItem[type].push(newItem);
            //return new element
            return newItem;
        },

        deleteItem: function(type, id) {
            var ids, index;

            ids = data.allItem[type].map(function(current) {
                return current.id;
            });
            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItem[type].splice(index, 1);
            }
        },

        calculateBudget: function() {
            //Calculate total Income and Expenses
            calculateTotal('inc');
            calculateTotal('exp');
            //Calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;
            //Calculate the percentage that we spent.
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },

        calculatePercentages: function() {

            data.allItem.exp.forEach(function(cur) {
                cur.calcPercentages(data.totals.inc)
            });

        },
        getPercentages: function() {
            var allPerc = data.allItem.exp.map(function(cur) {
                return cur.getPercentages();
            });
            return allPerc;
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },
        testing: function() {
            console.log(data);
        }
    };

})();

var UIController = (function() {
    // some code
    var domStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };
    var formatNumber = function(num, type) {
        /*
        +/- before the number
        exactly to decimal point
        comma seperating the thousands
        */
        var numSplit, int, dec, type;
        num = Math.abs(num);
        num = num.toFixed(2);
        numSplit = num.split('.');
        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }
        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    };
    var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };
    return {
        getInput: function() {
            return {
                type: document.querySelector(domStrings.inputType).value,
                description: document.querySelector(domStrings.inputDescription).value,
                value: parseFloat(document.querySelector(domStrings.inputValue).value),
            };
        },
        addListItem: function(obj, type) {
            var html, newHtml, element;
            //create html string place holder
            if (type === 'inc') {
                element = domStrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = domStrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            //replace the placeholder with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
            //Insert html into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deletListItem: function(selectorID) {

            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);

        },

        clearFields: function() {
            var fields, fieldsArr;
            fields = document.querySelectorAll(domStrings.inputDescription + ',' + domStrings.inputValue);
            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });
        },
        displayBudget: function(obj) {
            obj.budget >= 0 ? type = 'inc' : 'exp';
            document.querySelector(domStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(domStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(domStrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
            //document.querySelector(domStrings.percentageLabel).textContent = obj.percentage + '%';

            if (obj.percentage > 0) {
                document.querySelector(domStrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(domStrings.percentageLabel).textContent = '---';
            }

        },

        displayPercentages: function(percentages) {
            var fields = document.querySelectorAll(domStrings.expensesPercLabel);

            nodeListForEach(fields, function(current, index) {
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });
        },

        displayMonth: function() {
            var now, year, month, months;
            now = new Date();
            year = now.getFullYear();
            month = now.getMonth();
            months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            document.querySelector(domStrings.dateLabel).textContent = months[month] + ' ' + year;
        },
        changedType: function() {
            var fields = document.querySelectorAll(
                domStrings.inputType + ',' +
                domStrings.inputDescription + ',' +
                domStrings.inputValue);

            nodeListForEach(fields, function(cur) {
                cur.classList.toggle('red-focus');
            });

            document.querySelector(domStrings.inputBtn).classList.toggle('red');

        },

        getDomStrings: function() {
            return domStrings;
        }
    };
})();

var controller = (function(BudgetCtrl, UICtrl) {
    //some code
    var setupEventListeners = function() {
        var dom = UIController.getDomStrings();
        document.querySelector(dom.inputBtn).addEventListener('click', controllAddItem);


        document.addEventListener('keypress', function(e) {
            if (e.keyCode === 13 || e.which === 13) {
                controllAddItem();
            }
        });
        document.querySelector(dom.container).addEventListener('click', controlDeleteItem);
        document.querySelector(dom.inputType).addEventListener('change', UICtrl.changedType);

    };
    var updateBudget = function() {
        //do the computation (calculation the budget)
        BudgetCtrl.calculateBudget();
        //return budget
        var budget = BudgetCtrl.getBudget();
        //display the budget on user interface
        UICtrl.displayBudget(budget);
        //console.log(budget);
    };

    var updatePercentages = function() {

        //calculate percentages
        budgetController.calculatePercentages();
        //reading them from budget controller
        var percentages = budgetController.getPercentages();
        //update the UI with new percentage
        UIController.displayPercentages(percentages)
    };

    var controllAddItem = function() {
        var input, newItem;
        input = UIController.getInput();
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            //get the input data
            //add the item in budget controller
            newItem = budgetController.addItem(input.type, input.description, input.value);
            //add the item in UI
            UIController.addListItem(newItem, input.type);
            //clear fields
            UIController.clearFields();
            // calculate and update budget
            updateBudget();
            //calculate and update the percentages
            updatePercentages();
        }
        //console.log(input);


    };
    var controlDeleteItem = function(e) {
        var itemId, splitID;
        itemId = e.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemId) {
            splitID = itemId.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            //delete the item from the data structure
            budgetController.deleteItem(type, ID);
            //delet the item from the UI
            UIController.deletListItem(itemId)
                //update and show new budget.
            updateBudget();
            //calculate and update the percentages
            updatePercentages();
        }

    };
    return {
        init: function() {
            //console.log('Application has started!');
            UIController.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            })
            setupEventListeners();
        }
    };

})(budgetController, UIController);
controller.init();

var tester = {
    achiwali: [1, 2, 3],
    gandiwali: [3, 2, 1],
};