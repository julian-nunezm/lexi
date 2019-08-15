const consoleOn = false;
const startParagraphTag = "<p>";
const endParagraphTag = "</p>";
const startSpanOutTag = "<span class=\"out\">";
const startSpanOneKTag = "<span class=\"oneK\">";
const startSpanProperNounTag = "<span class=\"proper\">";
const endSpanTag = "</span>";
let notCommonWordsCounter = 0;
let commonWordsCounter = 0;
let amount = 0;
let commonWords = [];
//TODO: Check the use of different colors
let oneK = plainWords.slice(0,1000);
//alert(oneK.length);
let twoK = plainWords.slice(1000,2000);
//alert(twoK.length);
let fiveK = plainWords.slice(2000,5000);
//alert(fiveK.length);
let tenK = plainWords.slice(5000,10000);
//alert(tenK.length);
let twentyK = plainWords.slice(10000);
//alert(twentyK.length);

function checkText(){
    amount = checkAmount();
    commonWords = plainWords.slice(0,amount);
    let textToCheck = document.getElementById("toTranslate").value;
    if(consoleOn) {console.clear();}
    if(consoleOn) {console.log(textToCheck);}
    checkedMessage = splitByParagraphs(textToCheck);
    document.getElementById("translation").innerHTML = checkedMessage;
    document.getElementById("commonWords").innerHTML = "Total of simple words: " + commonWordsCounter;
    document.getElementById("notCommonWords").innerHTML = "Total of not simple words: " + notCommonWordsCounter;
    document.getElementById("words").innerHTML = "Total of words: " + (commonWordsCounter + notCommonWordsCounter);
    let percentageCommonWords = (commonWordsCounter/(commonWordsCounter + notCommonWordsCounter))*100;
    if(percentageCommonWords >= 80)
        document.getElementById("message").innerHTML = "<span class=\"well-done\">Well done!</span>";
    else
        document.getElementById("message").innerHTML = "<span class=\"double-check\">You should double check your message.</span>";
    document.getElementById("percentage").innerHTML = "The " + percentageCommonWords.toFixed(2) + "% of the words are common.";
    drawPieChart(commonWordsCounter, notCommonWordsCounter);
    commonWordsCounter = 0;
    notCommonWordsCounter = 0;  
}

function checkAmount(){
    let radioAmount = 0;
    document.getElementsByName("common").forEach(radio => {
        if (radio.checked) {
            radioAmount = radio.value;
        }
    });
    //document.getElementsByName("common").find((radio) => radio.checked == true).value;
    return radioAmount;
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
    let isIn = true;
    if(consoleOn) {console.log("      W:");}
    words.map(w => {
        if(w != ""){
            isIn = commonWords.includes(w.toLowerCase());
            //isIn = lookForWord("1k");
            //TODO: Check if SpanTag can be modified or not because it's const, check if possible to reduce the number of lines
            //TODO: Check the space at the end of a sentence.
            if(!isIn){
                checkedSimpleSentence += startSpanOutTag + w + endSpanTag + " ";
                notCommonWordsCounter += 1;
                if(consoleOn) {console.log("      Out: "+w);}
            } else {
                //TODO: Check the totals
                commonWordsCounter += 1;
                /*if(w.match(new RegExp(/^[A-Z]/)) !== null){
                    if(consoleOn) {console.log(w.match(new RegExp(/^[A-Z]/)) !== null);}
                    checkedSimpleSentence += startSpanProperNounTag + w + endSpanTag + " ";
                } else {*/
                    checkedSimpleSentence += w  + " ";
                    if(consoleOn) {console.log("      "+w);}
                //}
            }
        }
    });
    return checkedSimpleSentence;
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