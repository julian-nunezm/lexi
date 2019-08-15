const consoleOn = false;
const startParagraphTag = "<p>";
const endParagraphTag = "</p>";
let startSpanTag = "";
const endSpanTag = "</span>";
let notCommonWordsCounter = 0;
let commonWordsCounter = 0;
let isIn = true;
let whereIs = "";
let commonWords = [];

function checkText(){
    //Initialize values
    commonWords = plainWords.slice(0, Array.prototype.slice.call(document.getElementsByName("common")).find((radio) => radio.checked == true).value);
    
    //Get the text to analyze
    let textToCheck = document.getElementById("toTranslate").value;
    if(consoleOn) {console.clear();}
    if(consoleOn) {console.log(textToCheck);}
    
    //Split the initial check to chunks by paragraphs to analize them separately.
    checkedMessage = splitByParagraphs(textToCheck);
    
    //Print results
    document.getElementById("checkedMessage").innerHTML = checkedMessage;
    document.getElementById("commonWords").innerHTML = "Total of simple words: " + commonWordsCounter;
    document.getElementById("notCommonWords").innerHTML = "Total of not simple words: " + notCommonWordsCounter;
    document.getElementById("words").innerHTML = "Total of words: " + (commonWordsCounter + notCommonWordsCounter);
    let percentageCommonWords = (commonWordsCounter/(commonWordsCounter + notCommonWordsCounter))*100;
    if(percentageCommonWords >= 80)
        document.getElementById("message").innerHTML = "<span class=\"well-done\">Well done!</span>";
    else
        document.getElementById("message").innerHTML = "<span class=\"double-check\">You should double check your message.</span>";
    document.getElementById("percentage").innerHTML = "The " + percentageCommonWords.toFixed(2) + "% of the words are common.";
    
    //Draw Pie Chart
    drawPieChart(commonWordsCounter, notCommonWordsCounter);

    //Restart counters
    commonWordsCounter = 0;
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
            isIn = commonWords.includes(w.toLowerCase());
            whereIs = lookForWord(w);   //2 - 
            //TODO: Check if SpanTag can be modified or not because it's const, check if possible to reduce the number of lines
            //TODO: Check the space at the end of a sentence.
            if(isIn) commonWordsCounter += 1;
            else notCommonWordsCounter += 1;   //if(w.match(new RegExp(/^[A-Z]/)) !== null)
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

function drawPieChart(common, notCommon){
    google.charts.load('current', {'packages': ['corechart']});
    google.charts.setOnLoadCallback(drawChart);
    function drawChart(){
        let data = google.visualization.arrayToDataTable([
            ['Words','Amount'],
            ['Common words', common],
            ['Not Common words', notCommon]
        ]);

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