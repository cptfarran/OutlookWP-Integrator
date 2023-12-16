// Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // If the received message has the expected format...
    if (msg.text === 'get_table') {
        table = document.getElementsByTagName("tbody")[0]
        // Call the specified callback, passing
        // the web-page's DOM content as argument
        console.log("sending back table")
        console.log(table)
        console.log(typeof table)
        //alert(document.getElementsByTagName("table")[0])
        //sendResponse(document.getElementsByTagName("table")[0]);
        sendResponse(tableToAry(table))
    }
});

function tableToAry(table) {
    let data = [];
    let firstCheck = true;
    let wpSect = {
        items: []
    };
    let item = {};
    let inputs = table.getElementsByTagName("input")


    for (i=0; i<inputs.length; i++) {
        let name = inputs[i].name
        let val = inputs[i].value
        if (name = 'description') {
            if (name.includes(":")) { //header
                data.push(wpSect)
                let wpSect = {
                    items: []
                };
                wpSect.header = val;
            } else {
                wpSect.items.push(item)
                let item = {}
                item.title = val;
            }
        } else {
            item[name] = val;
        }

            
            
        
    }
    //assumes we don't end on a header
    wpSect.items.push(item) //add last item to final section
    data.push(wpSect) //adds the last section
    console.log(data)
    return data
}