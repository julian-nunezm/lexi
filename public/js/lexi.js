//ToDo: Comment everything
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
    document.getElementById("checkedMessage").innerHTML = checkedMessage;
    document.getElementById("commonWords").innerHTML = "Total of simple words: " + commonWordsCounter;
    document.getElementById("cenitexWords").innerHTML = "Total of Cenitex words: " + cenitexWordsCounter;
    document.getElementById("notCommonWords").innerHTML = "Total of not simple words: " + notCommonWordsCounter;
    let words = commonWordsCounter + cenitexWordsCounter + notCommonWordsCounter;
    document.getElementById("words").innerHTML = "Total of words: " + words;
    //ToDo: Validate if Cenitex worlds should count on this percentage
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
    let paragraphs = text.split(/\n/);
    let checkedMessage = "";
    if(consoleOn) {console.log("P:");}
    paragraphs.map(p => {
        if(p != " "){
            if(consoleOn) {console.log("-" + p);}
            checkedParagraph = splitByWholeSentences(p);
            checkedMessage += startParagraphTag + checkedParagraph + endParagraphTag;
        }
    });
    return checkedMessage;
}

function splitByWholeSentences(paragraph){
    let wholeSentences = paragraph.split(".");
    let checkedParagraph = "";
    if(consoleOn) {console.log("  WS:");}
    wholeSentences.map(ws => {
        if(ws != ""){
            if(consoleOn) {console.log("-->"+ws);}
            checkedWholeSentence = splitBySimpleSentences(ws);
            checkedParagraph += checkedWholeSentence + " "; //It already has the full stop.
        }
    });
    return checkedParagraph.substr(0, checkedParagraph.length - 1);
}

function splitBySimpleSentences(wholeSentence){
    let separator = ", ";
    let countCommas = 0;
    let simpleSentences = wholeSentence.split(",");
    let commas = simpleSentences.length-1;
    let checkedWholeSentence = "";
    if(consoleOn) {console.log("    SS:");}
    simpleSentences.map(ss => {
        if(ss != ""){
            ss = ss.trim();
            if(consoleOn) {console.log("---->" + ss);}
            checkedSimpleSentence = splitByWords(ss);
            if (countCommas >= commas) {separator = ".";}
            checkedWholeSentence += checkedSimpleSentence.substr(0, checkedSimpleSentence.length - 1) + separator;
            countCommas += 1;
        }
    });
    if(consoleOn) {console.log(checkedWholeSentence);}
    return checkedWholeSentence;
}

function splitByWords(simpleSentence){
    let words = simpleSentence.split(" ");
    let checkedSimpleSentence = "";
    if(consoleOn) {console.log("      W:");}
    words.map(w => {
        if(w != ""){
            isCommon = commonWords.includes(w.toLowerCase());
            whereIs = lookForWord(w);
            console.log(w + " (" + whereIs + ")");
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

            /*isCenitex = cenitex.includes(w.toLowerCase());
            if(isCenitex) {
                cenitexWordsCounter += 1;
                whereIs = "cenitex";
            } else {
                isCommon = commonWords.includes(w.toLowerCase());
                if(isCommon){
                    commonWordsCounter += 1;
                    whereIs = lookForWord(w);
                    console.log(w + " (" + whereIs + ")");
                }
                else notCommonWordsCounter += 1;
            }*/
            if(consoleOn) {console.log("------>" + w + " (" + whereIs + ")");}
            startSpanTag = "<span class=\"" + whereIs + "\">";
            checkedSimpleSentence += startSpanTag + w + endSpanTag + " ";
        }
    });
    checkedSimpleSentence = checkedSimpleSentence.substr(0,checkedSimpleSentence.length - 1) + ".";
    if(consoleOn) {console.log(checkedSimpleSentence);}
    return checkedSimpleSentence;
}

function lookForWord(word){
    //TODO: Improve if possible, use the previous slices, in checkText function OR get the index and make the validation against the index instead of doing it with more slices.
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

        let chart = new google.visualization.PieChart(document.getElementById('pieChart'));
        chart.draw(data, options);
    }
}