const startParagraphTag = "<p>";
            const endParagraphTag = "</p>";
            const startSpanOutTag = "<span class=\"out\">";
            const startSpanProperNounTag = "<span class=\"proper\">";
            const endSpanTag = "</span>";
            let wordsTotal = 0;
            let commonWordsTotal = 0;
            //TODO: Percentages
            function checkText(){
                let textToCheck = document.getElementById("toTranslate").value;
                console.clear();
                console.log(textToCheck);
                checkedMessage = splitByParagraphs(textToCheck);
                document.getElementById("translation").innerHTML = checkedMessage;
                document.getElementById("wordsTotal").innerHTML = "Total of words: " + wordsTotal;
                document.getElementById("commonWordsTotal").innerHTML = "Total of common words: " + commonWordsTotal;
                document.getElementById("percentage").innerHTML = "The " + ((commonWordsTotal/wordsTotal)*100) + "% of the words are common.";
                
                drawPieChart(commonWordsTotal, wordsTotal-commonWordsTotal);

                wordsTotal = 0;
                commonWordsTotal = 0;  
            }

            //TODO: Improve this function!
            function checkAmount(){
                let amount = document.getElementById("1k");
                if (amount.checked) return amount.value;
                amount = document.getElementById("2k");
                if (amount.checked) return amount.value;
                amount = document.getElementById("5k");
                if (amount.checked) return amount.value;
                amount = document.getElementById("10k");
                if (amount.checked) return amount.value;
                amount = document.getElementById("20k");
                if (amount.checked) return amount.value;
            }

            function splitByParagraphs(text){
                let paragraphs = text.split(/\n\n/);
                let checkedMessage = "";
                console.log("P:");
                paragraphs.map(p => {
                    console.log(p);
                    checkedParagraph = splitByWholeSentences(p);
                    checkedMessage += startParagraphTag + checkedParagraph + endParagraphTag;
                });
                return checkedMessage;
            }

            function splitByWholeSentences(paragraph){
                let wholeSentences = paragraph.split(".");
                let checkedParagraph = "";
                console.log("  WS:");
                wholeSentences.map(ws => {
                    console.log("  "+ws);
                    checkedWholeSentence = splitBySimpleSentences(ws);
                    checkedParagraph += checkedWholeSentence + ". ";
                });
                return checkedParagraph;
            }

            function splitBySimpleSentences(wholeSentence){
                let simpleSentences = wholeSentence.split(",");
                let checkedWholeSentence = "";
                console.log("    SS:");
                simpleSentences.map(ss => {
                    console.log("    "+ss);
                    checkedSimpleSentence = splitByWords(ss);
                    checkedWholeSentence += checkedSimpleSentence + ", ";
                });
                return checkedWholeSentence;
            }

            function splitByWords(simpleSentence){
                const amount = checkAmount();
                let words = simpleSentence.split(" ");
                let checkedSimpleSentence = "";
                console.log("      W:")
                words.map(w => {
                    let isIn = plainWords.slice(0,amount).includes(w.toLowerCase());
                    wordsTotal += 1;
                    //TODO: Check if SpanTag can be modified or not because it's const, check if possible to reduce the number of lines
                    //TODO: Check the space at the end of a sentence.
                    if(!isIn){
                        checkedSimpleSentence += startSpanOutTag + w + endSpanTag + " ";
                        console.log("      Out: "+w);
                    } else {
                        //TODO: Check the totals
                        commonWordsTotal += 1;
                        if(w.match(new RegExp(/^[A-Z]/)) !== null){
                            console.log(w.match(new RegExp(/^[A-Z]/)) !== null);
                            checkedSimpleSentence += startSpanProperNounTag + w + endSpanTag + " ";
                        } else {
                            checkedSimpleSentence += w  + " ";
                            console.log("      "+w);
                        }
                    }
                    return checkedSimpleSentence;
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

                    let options = {/*title: 'How accessible your message is...', titleTextStyle: {fontSize: 20}, */legend: {position: 'bottom', textStyle: {fontSize: 16}}, chartArea: {left:20,right:0,width:'100%',/*height:'100%'*/}};

                    let chart = new google.visualization.PieChart(document.getElementById('piechart'));
                    chart.draw(data, options);
                }
            }