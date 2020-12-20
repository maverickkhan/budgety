var budgetController = (function() {
    // some code
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }
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
        container: '.container'
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
            newHtml = newHtml.replace('%value%', obj.value)
                //Insert html into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
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
            document.querySelector(domStrings.budgetLabel).textContent = obj.budget;
            document.querySelector(domStrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(domStrings.expensesLabel).textContent = obj.totalExp;
            //document.querySelector(domStrings.percentageLabel).textContent = obj.percentage + '%';

            if (obj.percentage > 0) {
                document.querySelector(domStrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(domStrings.percentageLabel).textContent = '---';
            }

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
        }
        //console.log(input);


    };
    var controlDeleteItem = function(e) {
        var itemId, splitID;
        itemId = e.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemId) {
            splitID = itemId.split('-');
            type = splitID[0];
            ID = splitID[1];

            //delete the item from the data structure

            //delet the item from the UI

            //update and show new budget.
        }

    };
    return {
        init: function() {
            //console.log('Application has started!');
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