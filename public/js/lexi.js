const consoleOn = false;
const startParagraphTag = "<p>";
const endParagraphTag = "</p>";
let startSpanTag = "";
const endSpanTag = "</span>";
let commonWordsCounter = 0;
let cenitexWordsCounter = 0;
let notCommonWordsCounter = 0;
let isCommon = true;
let isCenitex = true;
let whereIs = "";

function checkText(){
    //Initialize values
    commonWords = plainWords.slice(0, Array.prototype.slice.call(document.getElementsByName("common")).find((radio) => radio.checked == true).value);
    
    //Get the text to analyze
    let textToCheck = document.getElementById("textToCheck").value;
    if(consoleOn) {console.clear();}
    if(consoleOn) {console.log(textToCheck);}
    
    //Split the initial check to chunks by paragraphs to analize them separately.
    checkedMessage = splitByParagraphs(textToCheck);
    
    //Print results
    //ToDo: Try printing the original message looping through the original words to keep any extra character
    document.getElementById("checkedMessage").innerHTML = checkedMessage;
    document.getElementById("commonWords").innerHTML = "Total of simple words: " + commonWordsCounter;
    document.getElementById("cenitexWords").innerHTML = "Total of Cenitex words: " + cenitexWordsCounter;
    document.getElementById("notCommonWords").innerHTML = "Total of not simple words: " + notCommonWordsCounter;
    let words = commonWordsCounter + cenitexWordsCounter + notCommonWordsCounter;
    document.getElementById("words").innerHTML = "Total of words: " + words;
    //ToDoK: Validate if Cenitex worlds should count on this percentage
    let percentageCommonWords = (commonWordsCounter/words)*100;
    if(percentageCommonWords >= 80)
        document.getElementById("message").innerHTML = "<span class=\"well-done\">Well done!</span>";
    else
        document.getElementById("message").innerHTML = "<span class=\"double-check\">You should double check your message.</span>";
    document.getElementById("percentage").innerHTML = "The " + percentageCommonWords.toFixed(2) + "% of the words are common.";
    
    //Draw Pie Chart
    drawPieChart(commonWordsCounter, cenitexWordsCounter, notCommonWordsCounter);

    //Restart counters
    commonWordsCounter = 0;
    cenitexWordsCounter = 0;
    notCommonWordsCounter = 0;
}

function splitByParagraphs(text){
    let paragraphs = text.split(/\n\n/);
    let checkedMessage = "";
    if(consoleOn) {console.log("P:");}
    paragraphs.map(p => {
        if(consoleOn) {console.log(p);}
        checkedParagraph = splitByWholeSentences(p);
        checkedMessage += startParagraphTag + checkedParagraph + endParagraphTag;
    });
    return checkedMessage;
}

function splitByWholeSentences(paragraph){
    let wholeSentences = paragraph.split(".");
    let checkedParagraph = "";
    if(consoleOn) {console.log("  WS:");}
    wholeSentences.map(ws => {
        if(consoleOn) {console.log("  "+ws);}
        checkedWholeSentence = splitBySimpleSentences(ws);
        checkedParagraph += checkedWholeSentence + ". ";
    });
    return checkedParagraph;
}

function splitBySimpleSentences(wholeSentence){
    let simpleSentences = wholeSentence.split(",");
    console.log(simpleSentences[0]);
    console.log(typeof simpleSentences[0]);
    //TODO: Como poner coma al final.
    let checkedWholeSentence = "";
    if(consoleOn) {console.log("    SS:");}
    simpleSentences.map(ss => {
        if(ss != ""){
            ss = ss.trim();
            console.log("Simple sentence: "+ ss +" - Tipo: "+typeof ss);
            if(consoleOn) {console.log("    "+ss);}
            checkedSimpleSentence = splitByWords(ss);
            checkedWholeSentence += checkedSimpleSentence + ", ";
        }
    });
    return checkedWholeSentence;
}

function splitByWords(simpleSentence){
    let words = simpleSentence.split(" ");
    let checkedSimpleSentence = "";
    if(consoleOn) {console.log("      W:");}
    words.map(w => {
        if(w != ""){
            isCommon = commonWords.includes(w.toLowerCase());
            whereIs = lookForWord(w);   //2 - 
            //TODO: Check if SpanTag can be modified or not because it's const, check if possible to reduce the number of lines
            //TODO: Check the space at the end of a sentence.
            if(isCommon) commonWordsCounter += 1;
            else {
                //if(w.match(new RegExp(/^[A-Z]/)) !== null)
                isCenitex = cenitex.includes(w.toLowerCase());
                if(isCenitex) {
                    cenitexWordsCounter += 1;
                    whereIs = "cenitex";
                }
                else notCommonWordsCounter += 1;
            }
            startSpanTag = "<span class=\"" + whereIs + "\">";
            checkedSimpleSentence += startSpanTag + w + endSpanTag + " ";    //TODO: Check the space at the end
        }
    });
    return checkedSimpleSentence;
}

function lookForWord(word){ //2 - 
    //TODO: Improve if possible, use the previous slices, in checkText function!!
    let within = plainWords.slice(10000).includes(word.toLowerCase());
    if (within) return "twentyK";
    within = plainWords.slice(5000,10000).includes(word.toLowerCase());
    if (within) return "tenK";
    within = plainWords.slice(2000, 5000).includes(word.toLowerCase());
    if (within) return "fiveK";
    within = plainWords.slice(1000, 2000).includes(word.toLowerCase());
    if (within) return "twoK";
    within = plainWords.slice(0, 1000).includes(word.toLowerCase());
    if (within) return "oneK";
    return "out";
}

function drawPieChart(common, cenitex, notCommon){
    google.charts.load('current', {'packages': ['corechart']});
    google.charts.setOnLoadCallback(drawChart);
    function drawChart(){
        let data = google.visualization.arrayToDataTable([
            ['Words','Amount'],
            ['Common words', common],
            ['Cenitex words', cenitex],
            ['Not Common words', notCommon]
        ]);
        //ToDo: Change the color of Cenitex Words to orange and notcommon to red in the chart!
        let options = {
            title: 'How accessible your message is...',
            titleTextStyle: {fontSize: 20},
            legend: {
                position: 'bottom',
                textStyle: {
                    fontSize: 16
                }
            },
            chartArea: {
                left: 20,
                right: 0,
                //width: 600,
                //height:'100%'
            }
        };

        let chart = new google.visualization.PieChart(document.getElementById('piechart'));
        chart.draw(data, options);
    }
}