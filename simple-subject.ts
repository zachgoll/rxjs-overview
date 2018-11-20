import { Subject } from "rxjs-compat/Subject";

function addToList(subjectId: any, text: any) {
    let li = document.createElement('li');
    let textNode = document.createTextNode(text);
    li.appendChild(textNode);
    li.classList.add("list-group-item");
    document.getElementById(subjectId).appendChild(li);
}

function getDate() {
    const now = new Date(Date.now());
    const hour = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    return `minute ${minutes}, second ${seconds}`;
}

let subjectFunction = () => {
    let subject = new Subject();

    let count = 0;

    subject.subscribe(
        streamItem => {
            addToList("subject1", streamItem);
        },
        err => console.error(err),
        () => console.log('done')
    );

    setTimeout(() => {
        document.getElementById("join-time-2").innerHTML = `Subject subscriber 1 joined at: ${getDate()}`;
        let subscriber1 = subject.subscribe(
            streamItem => {
                addToList("subject2", streamItem);
            },
            err => console.error(err),
            () => console.log('done')
        );
    }, 5000);

    // After  seconds, join a second subscriber to the subject
    setTimeout(() => {
        document.getElementById("join-time-3").innerHTML = `Subject subscriber 2 joined at: ${getDate()}`;
        let subscriber2 = subject.subscribe(
            streamItem => {
                addToList("subject3", streamItem);
            },
            err => console.error(err),
            () => console.log('done')
        );
    }, 9000);

    setInterval(() => {
        const names = ["Bob", "Susie", "John", "Jeff", "Kris", "Ben", "Zach"];
        subject.next(`${names[count]} arrived at: ${getDate()}`);
        if (count === names.length - 1) {
            subject.complete();
        } else {
            count++;
        }
    }, 2000);
    
};

export default subjectFunction;