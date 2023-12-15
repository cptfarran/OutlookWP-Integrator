function myFunction(x) {
    x.classList.toggle("change");
  }

const getToDos = (resource, callback) => {
    const request = new XMLHttpRequest();

    request.addEventListener('readystatechange', (event) => {
        //console.log(request, request.readyState);
        if(request.readyState === 4 & request.status === 200) {
            const data = JSON.parse(request.responseText)
            callback(undefined, data);
        } else if (request.readyState === 4) {
            callback('404 request could not be complete', undefined);
        }
    });

    request.open('GET',resource)
    request.send()
};

getToDos('/meetings/events.json', (err, data) => {
    let headerAry = []
    let meetingsAry = []
    if(err){
        console.log(err)
    } else {
            console.log(data)
            data.sort(data.subject)
            data.forEach(e => {
                delete e.eventID //solely to make it easier to read in the console
                //console.log(e.duration)
                //console.log(e.subject)
                //console.log("allDay: "+e.isAllDayEvent)
                //console.log("categories: "+getCatString(e)) //breaks if there's more than one category, for now
                //console.log(" ")
                
                if (shouldIgnoreMeeting(e)) {
                    e.ignore=true
                } else {
                    e.ignore=false
                    preProcessMeetings(e, headerAry, meetingsAry);
                }
                //console.log(meetingsAry)
            });

        //Create body of page
        headerAry.sort()
        meetingsAry.sort()
        //console.log(data)
        //console.log(headerAry)
        console.log(meetingsAry)

        for (let i = 0; i < headerAry.length; i++) {
            addHeader(headerAry[i])
        }
        for (let i = 0; i < meetingsAry.length; i++) {
            let meeting = meetingsAry[i]
            addMeeting(meeting.header,meeting.subject,meeting.duration)
        }

    };
});

/// --- BEGIN HTML Building --- ///

function addHeader(header,addButton=true) {
    let newHeader = easyElement("div","header-container")
    newHeader.setAttribute("id",header)
    
    //Create header contents (name and import button)
    let h3=document.createElement("h3");
    h3.innerHTML = header;
    if (addButton) {
        let button=easyElement("button","import-button");
        h3.appendChild(button)
    }
    newHeader.appendChild(h3)

    const main = document.getElementsByTagName("main")[0]
    main.appendChild(newHeader)
}

function addMeeting(header,subj,length,status) {
    let newMeeting = easyElement("div", "meeting-container")

    //Create meeting contents (name, status, and length)
    let meetingNam = easyElement("span","meeting-name",subj)
    let meetingStat = easyElement("span","meeting-status",status)
    let meetingLen = easyElement("span","meeting-length",length)

    newMeeting.appendChild(meetingNam)
    newMeeting.appendChild(meetingStat)
    newMeeting.appendChild(meetingLen)
    
    const currHeader = document.getElementById(header)
    currHeader.appendChild(newMeeting)
}

function easyElement(type,addClass,text="") {
    let ele = document.createElement(type)
    ele.classList.add(addClass)
    if (text != "") {
        ele.appendChild(document.createTextNode(text))
    }
    return ele
}

/// --- END HTML Building --- ///




/// --- BEGIN Helper Functions --- ///


function preProcessMeetings(e, hAry, mAry) {
    header = getHeaderForMeeting(e)
    if (!hAry.includes(header)) {
        hAry.push(header)
    }
    //Add logic to combine meetings with the same name in future
    mAry.push(e)
    e.header=header
}

function getCatString(event) {
    let cats = ""
    if (event.categories.length != 0) {
        return event.categories[0].name //good enough
    }
    return cats
    
}

function shouldIgnoreMeeting(event) {
    let cat = getCatString(event);
    if (event.isAllDayEvent) {
        console.log(event.subject + "\n [IGNORED] All day events are ignored")
        return true
    }
    //change this to check for all categories
    if (cat == 'Reminders') {
        console.log(event.subject + "\n [IGNORED] 'Reminders' are ignored")
        return true
    };
    return false
};

function getHeaderForMeeting(e) {
    //Simplifying for now - each category is it's own header
    cat = getCatString(e)
    let header = cat;
    if (header !="") {
        // make strings to remove editable
        return header.replace("_","")
    } else {
        return "Undefined"
    }
}

/// --- END Helper Functions --- ///