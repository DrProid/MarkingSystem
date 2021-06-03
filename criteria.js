let editMode = false;
let criteriaSettings = {};
let criteriaObjects = [];
let editCriteriaButtonList = [];

function loadStudent() {
    logFunctionName(arguments);
}

function saveStudent() {
    logFunctionName(arguments);
    //criteria keys and values that represent grades
    //criteria keys and strings for custom comments
}

function loadCriteria() {
    logFunctionName(arguments);
}

function saveCriteria() {
    logFunctionName(arguments);
}

//make the buttons JSON
let toolbarButtonList = {
    "Load Student": {
        btn: {},
        editModeOnly: false,
        funcRef: loadStudent
    },
    "Save Student": {
        btn: {},
        editModeOnly: false,
        funcRef: saveStudent
    },
    "Edit Mode": {
        btn: {},
        editModeOnly: false,
        funcRef: setEditMode
    },
    "Load Criteria": {
        btn: {},
        editModeOnly: true,
        funcRef: loadCriteria
    },
    "Save Criteria": {
        btn: {},
        editModeOnly: true,
        funcRef: saveCriteria
    }
};
function makeToolbarSection() {
    logFunctionName(arguments);
    // get the element you want to add the button to
    var toolbarDiv = document.getElementById("toolbar");
    for (key in toolbarButtonList) {
        // create the button object and add a reference to it in buttonsList
        toolbarButtonList[key].btn = document.createElement("button");
        //add the appropriate text for the button
        toolbarButtonList[key].btn.innerHTML = key;
        // add the button to the div
        toolbarDiv.appendChild(toolbarButtonList[key].btn);
        // add event handler
        toolbarButtonList[key].btn.addEventListener("click", toolbarButtonList[key].funcRef);
    }
}
// call makeToolbar to generate the buttons at the top of the page
makeToolbarSection();


function makeRoundButton(parentDiv, symbol, colour, funcRef) {
    let newButton = document.createElement("button");//make a new button
    newButton.setAttribute("class", "roundButton");//inherit css
    parentDiv.appendChild(newButton);//put in the div
    newButton.style.backgroundColor = colour;//set the colour
    newButton.addEventListener("click", funcRef);//add function callback

    let symbolDiv = document.createElement("div");//add a div for the symbol
    if (symbol.length > 1) {
        symbolDiv.style.fontSize = '12pt';
    }
    symbolDiv.innerHTML = symbol;//set the symbol
    newButton.appendChild(symbolDiv);//put it in the button

    //editCriteriaButtonList.push(newButton);//push the button into the list for enable/disable visibility
    return newButton;
}

function makeSlider(parentDiv, funcRef) {
    let newSlider = document.createElement("input");//make a new slider
    newSlider.setAttribute("class", "slider");//inherit css
    newSlider.setAttribute("type", "range");
    newSlider.setAttribute("max", "100");
    newSlider.setAttribute("min", "0");
    newSlider.setAttribute("value", "50");
    //newSlider.setAttribute("step", "0.05");
    parentDiv.appendChild(newSlider);//put in the div
    newSlider.addEventListener("click", funcRef);//add function callback
    return newSlider;
}

function addToolTip(parentDiv, string){
    logFunctionName(arguments);
    let newToolTip = document.createElement("span");//make a new tooltip
    newToolTip.setAttribute("class", "tooltiptext");//inherit css
    newToolTip.innerHTML = string;
    parentDiv.appendChild(newToolTip);//put in the div
}

function makeCriteriaSection() {
    logFunctionName(arguments);
    var criteriaDiv = document.getElementById("criteria");
    let addButton = makeRoundButton(criteriaDiv, "+", "#47c415", addCriteriaGroup)
    addToolTip(addButton,"Add a Criteria Group");
    editCriteriaButtonList.push(addButton);
}
makeCriteriaSection();

function addCriteriaGroup() {
    logFunctionName(arguments);
    let criteriaDiv;
    if (arguments[0].nodeName != 'DIV') {
        criteriaDiv = document.getElementById("criteriaList");
    } else {
        criteriaDiv = arguments[0];
    }
    //add a new CriteriaGroup to the page
    criteriaObjects.push(new CriteriaGroup(criteriaDiv));
}

function addGradingSection(prevDiv) {
    logFunctionName(arguments);
    //add a new subCriteria to the parent div
    criteriaObjects.push(new SubCriteria(prevDiv));
}

class CriteriaGroup {
    constructor(parentDiv) {
        //make a new div to house the criteria group
        this.div = document.createElement("div");
        this.div.className = "criteriaGroup";
        this.div.id = "criteriaGroup" + document.getElementsByClassName("criteriaGroup").length;
        parentDiv.appendChild(this.div);

        //store the keyname for future reference
        this.keyname = this.div.id;

        //make a container for the top line and bottom line
        this.topLine = document.createElement("div");
        this.div.appendChild(this.topLine);
        this.bottomLine = document.createElement("div");
        this.div.appendChild(this.bottomLine);

        //add a delete group button
        this.deleteButton = makeRoundButton(this.topLine, "-", "rgb(255,0,0)", (e) => this.deleteGroup.call(this, e));
        addToolTip(this.deleteButton, "Delete Group");

        //make an input box for the title
        this.inputBox = document.createElement("input");
        this.inputBox.setAttribute("class", "inputH2");
        this.inputBox.setAttribute("type", "text");
        this.topLine.appendChild(this.inputBox);
        this.inputBox.addEventListener('input', (e) => this.updateTitle.call(this, e));

        //make a heading for the title
        this.heading = document.createElement("h2");
        this.topLine.appendChild(this.heading);

        //set the input box and heading to title if it exists
        try {
            this.title = criteriaSettings[this.keyname].title;
        }
        catch (err) {
            this.title = "Criteria Group";
        }
        this.inputBox.setAttribute("value", this.title);
        this.heading.innerHTML = this.title;

        //add button for add criteria group
        this.addSubGroupButton = makeRoundButton(this.bottomLine, "+", "#11f29c", () => this.addSubGroup.call(this));
        addToolTip(this.addSubGroupButton, "Add Nested Group");
        this.addSubGroupButton.style.marginLeft = "50px";
        //add button for add subcriteria
        this.addSubCriteriaButton = makeRoundButton(this.bottomLine, "v", "#f2be13", () => this.addAssess.call(this));
        this.addSubCriteriaButton.style.marginLeft = "130px";
        addToolTip(this.addSubCriteriaButton, "Add Marking");
        this.setEdit(editMode);
    }
    setEdit(isEdit) {
        this.heading.style.display = (!isEdit ? "inline" : "none");
        this.inputBox.style.display = (isEdit ? "inline" : "none");
        this.deleteButton.style.display = (isEdit ? "inline" : "none");
        this.addSubGroupButton.style.display = (isEdit ? "inline" : "none");
        this.addSubCriteriaButton.style.display = (isEdit ? "inline" : "none");
        this.div.style.borderStyle = (isEdit ? "dashed" : "none");
    }
    updateTitle(e) {
        this.title = e.target.value;
        this.heading.innerHTML = this.title;
    }
    deleteGroup() {
        this.div.remove();
    }
    addSubGroup() {
        addCriteriaGroup(this.div);
    }
    addAssess() {
        addGradingSection(this.bottomLine);
    }
}

class SubCriteria {
    constructor(nextDiv) {
        this.div = document.createElement("div");
        this.div.className = "subCriteria";
        this.div.id = "subCriteria" + document.getElementsByClassName("subCriteria").length;
        nextDiv.insertAdjacentElement('beforebegin',this.div);
        //make a container for the top heading line
        let topLine = document.createElement("div");
        this.div.appendChild(topLine);

        //add a delete group button
        this.deleteButton = makeRoundButton(topLine, "-", "rgb(255,0,0)", (e) => this.deleteGroup.call(this, e));
        addToolTip(this.deleteButton, "Delete Group");

        //make an input box for the title
        this.inputBox = document.createElement("input");
        this.inputBox.setAttribute("class", "inputH3");
        this.inputBox.setAttribute("type", "text");
        topLine.appendChild(this.inputBox);
        this.inputBox.addEventListener('input', (e) => this.updateTitle.call(this, e));

        //make a heading for the title
        this.heading = document.createElement("h3");
        topLine.appendChild(this.heading);

        //set the input box and heading to title if it exists
        try {
            this.title = criteriaSettings[this.keyname].title;
        }
        catch (err) {
            this.title = "Grading";
        }
        this.inputBox.setAttribute("value", this.title);
        this.heading.innerHTML = this.title;
        //make a container for the scores line
        let scoreLine = document.createElement("div");
        this.div.appendChild(scoreLine);

        //add a reset button
        this.resetButton = makeRoundButton(scoreLine, "reset", "rgb(255,0,0)", () => this.resetFields.call(this));

        //add slider
        this.slider = makeSlider(scoreLine, (e) => this.updateFields.call(this, e));
        //make an input box for the grade
        this.gradeInput = document.createElement("input");
        this.gradeInput.setAttribute("type", "number");
        this.gradeInput.setAttribute("class", "inputH2");
        this.gradeInput.style.width = "100px"
        this.gradeInput.value = '50';
        scoreLine.appendChild(this.gradeInput);
        this.gradeInput.addEventListener('input', (e) => this.updateFields.call(this, e));
        //add a text object for displaying letter grade
        this.letterGrade = document.createElement("h2");
        this.letterGrade.innerHTML = 'P';
        this.letterGrade.style.display = 'inline';
        this.letterGrade.style.marginLeft = '20px';
        scoreLine.appendChild(this.letterGrade);

        //comment section
        this.commentBox = document.createElement("textarea");
        this.commentBox.setAttribute("class", "inputH5");
        this.commentBox.style.width = "100%"
        this.commentBox.value = 'Comment Box';
        this.div.appendChild(this.commentBox);

        this.setEdit(editMode);
    }
    setEdit(isEdit) {
        this.heading.style.display = (!isEdit ? "inline" : "none");
        this.inputBox.style.display = (isEdit ? "inline" : "none");
        this.deleteButton.style.display = (isEdit ? "inline" : "none");
        this.resetButton.style.display = (!isEdit ? "inline" : "none");
    }
    updateTitle(e) {
        this.title = e.target.value;
        this.heading.innerHTML = this.title;
    }
    resetFields() {
        this.letterGrade.innerHTML = 'P';
        this.gradeInput.value = 50;
        this.slider.value = 50;
    }
    updateFields(e) {
        let newvalue = parseFloat(e.target.value);
        if (newvalue != NaN) {
            this.gradeInput.value = newvalue;
            this.slider.value = newvalue;
            // console.log(this.slider.value, this.gradeInput.value);
            this.letterGrade.innerHTML = 'F';
            if (newvalue > 50) {
                this.letterGrade.innerHTML = 'P';
                if (newvalue > 65) {
                    this.letterGrade.innerHTML = 'C';
                    if (newvalue > 75) {
                        this.letterGrade.innerHTML = 'D';
                        if (newvalue > 85) {
                            this.letterGrade.innerHTML = 'HD';
                        }
                    }
                }
            }

        }
    }
    deleteGroup() {
        this.div.remove();
    }
}

function setEditMode() {
    logFunctionName(arguments);

    //update the editMode state
    if (arguments[0] == false || arguments[0] == true) {
        //argument sets the editMode
        editMode = arguments[0];
    } else {
        //argument is probably click from the button
        editMode = !editMode;
    }

    // show or hide all the appropriate buttons
    for (key in toolbarButtonList) {
        if (toolbarButtonList[key].editModeOnly == true) {
            toolbarButtonList[key].btn.style.display = (editMode ? "inline" : "none");
        }
    }
    for (key in editCriteriaButtonList) {
        editCriteriaButtonList[key].style.display = (editMode ? "inline" : "none");
    }

    //toggle the edit modes of the criteriaGroups
    for (crit of criteriaObjects.values()) {
        crit.setEdit(editMode);
    }
}
setEditMode(false);

//useful debugging function that prints the containing function to console. call it like this logFunctionName(arguments);
function logFunctionName(func) {
    //https://stackoverflow.com/questions/1013239/can-i-get-the-name-of-the-currently-running-function-in-javascript
    console.log(func.callee.toString().substr(0, func.callee.toString().indexOf('(')).substr('function '.length));
}