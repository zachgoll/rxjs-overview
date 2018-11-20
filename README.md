[Blog Post](https://zachgoll.github.io/blog/2018/understanding-rxjs/) (originally adapted from [this video](https://www.youtube.com/watch?v=PhggNGsSQyg&t=564s))

## Introduction

To many (like myself) who learned the Angular framework prior to fully understanding asynchronous programming methods, the rxjs library is a big blur.  It has been a constant struggle for me to distinguish between Observables (Typescript) and Promises (ES6), and when to use them.  The real answer?  [These are mutually exclusive concepts](https://stackoverflow.com/questions/37364973/promise-vs-observable).  In most cases, it would make little sense to use Promises and Observables in the same codebase because they are both ways to do roughly the same thing.  From what I have seen, the general consensus in the javascript community is that Typescript paired with rxjs is the way to go.  I personally have developed a stronger taste for Typescript the longer I have programmed with it, and I think you will too as you work through this brief tutorial on rxjs.  Typescript is no more than a _flavor_ of javascript that can be transpiled down into code that runs in the browser via a module called webpack.  You can see the webpack configuration in the `webpack.config.js` and the Typescript config in `tsconfig.json`.  These two configuration files make it so we as developers can write code using Typescript and rxjs and let webpack convert it to stuff that actually works in modern browsers.  Pretty cool stuff!

## Environment Setup 

_Note: the original tutorial is ever so slightly outtdated, so I have included a few modifications here that make it work correctly such as adding the `rxjs-compat` package._

```bash  
git clone https://github.com/zachgoll/rxjs-overview.git
yarn install
yarn run start
```

This will serve the simple app at `localhost:8080`.

## Creating the Observable 

An observable has 3 states: 

1. Active
2. Done 
3. Error

```Typescript
import "rxjs-compat/Observable";
import { Observable } from "rxjs-compat/Observable";

let observable = Observable.create((observerControl: any) => {
    let counter = 1;
    try {
        // Make this function like a real Observable would
        // It ends once the count reaches 10
        setInterval(() => {
            observerControl.next(`Count is: ${counter}`);
            if (counter >= 10) {
                observerControl.complete();
            } else {
                counter++;
            }
        }, 1000);
    } catch (err) {
        observerControl.error(err);
    }
});

export default observable;
```

This simple observable will count to 10 and then enter the Done state by called the `complete()` method.

## Subscribing to the observable

```typescript 
import observable from "./simple-observable";

let observer1 = observable.subscribe(
    // Next stream item goes here
    (streamItem: any) => {
        document.getElementById("my-list-item-1").innerHTML = streamItem;
    },
    // Caught errors go here
    (err: any) => {

    },
    // Executed when Observable completes 
    () => {
        document.getElementById("my-list-item-1").innerText = `Done at 00:${new Date(Date.now()).getSeconds()}`;
    }
);

// Start the second observer 2 seconds after the first but to the same observable
setTimeout(() => {
    let observer2 = observable.subscribe(
        // Next stream item goes here
        (streamItem: any) => {
            document.getElementById("my-list-item-2").innerHTML = streamItem;
        },
        // Caught errors go here
        (err: any) => {
    
        },
        // Executed when Observable completes 
        () => {
            document.getElementById("my-list-item-2").innerText = `Done at 00:${new Date(Date.now()).getSeconds()}`;
        }
    );
}, 2000);
```

We can see that even if we subscribe a few seconds after the first subscriber, we still get the same exact history of stream data; it just comes later.

## Child Subscribers 

If we want to make one subscriber dependent on another, we can use a parent-child subscription.

```typescript
let observer1 = observable.subscribe(
    // Next stream item goes here
    (streamItem: any) => {
        document.getElementById("my-list-item-3").innerHTML = streamItem;
    },
    // Caught errors go here
    (err: any) => {

    },
    // Executed when Observable completes 
    () => {
        document.getElementById("my-list-item-3").innerText = `Done at 00:${new Date(Date.now()).getSeconds()}`;
    }
);

let observer2 = observable.subscribe(
    // Next stream item goes here
    (streamItem: any) => {
        document.getElementById("my-list-item-4").innerHTML = streamItem;
    },
    // Caught errors go here
    (err: any) => {

    },
    // Executed when Observable completes 
    () => {
        document.getElementById("my-list-item-4").innerText = `Done at 00:${new Date(Date.now()).getSeconds()}`;
    }
);

observer1.add(observer2);

// After 4 seconds, let's unsubscribe both observers
// All we need to do is unsubscribe the parent observer and it
// will cascade down and unsubscribe the child observer
setTimeout(() => {
    observer1.unsubscribe();
    document.getElementById("my-list-item-3").innerText = 'The parent observer unsubscribed both observers';
    document.getElementById("my-list-item-4").innerText = 'The parent observer unsubscribed both observers';    
}, 4000);
```

## Subjects 

Subjects are Observables with the additional ability to emit values.

```Typescript
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
```

In the UI, you will see that with Subjects, the subscribers will always pick up with the _current_ stream value rather than getting the entire history of the stream (as an Observable does).

### Behavior Subject 

A behavior subject acts similar to a regular subject except instead of receiving the _current_ stream value, a new subscriber will receive the _most recent_ stream value.  What's the point of this?  Well, this is used in some authentication schemes where you want to know the previous auth token or logged in status.

### Replay Subject 

A replay subject acts like a behavior subject except rather than receiving stream values starting at the _most recent_ value, a subscriber receives a _specified_ number of previous stream values.  For example, `new ReplaySubject(3)` will receive 3 values prior to the most recent value.

This type of subject is powerful because you can also specify a time interval that values should come from.  For example, `new ReplaySubject(3, 10000)` would look for the last 3 items within the last 10 seconds.

### Async Subject 

Subscribing to an async subject will give you only the _last_ value.  In other words, if the source observable never returns any data, neither will the async subject.  Mechanically, it waits for the _Done_ state of the observable and then sends the _most recent_ value that was sent prior to ending.

## Operators 

In rxjs, there are over 100 operators, all of which have their specific uses.  There is no point in learning each one of them, but important to understand what the purpose of them is.  The purpose of an operator is to _modify_ an existing subject or observable.  They will _intercept_ a subject or observable, do something to it, and then return another subject or observable.

A very basic example: 

```Typescript
import { from } from "rxjs/Observable/from";
import "rxjs/add/operator/pluck";

from([
    { prop1: 'value1', prop2: 'anothervalue1' },
    { prop1: 'value2', prop2: 'anothervalue2' },
    { prop1: 'value3', prop2: 'anothervalue3' },
    { prop1: 'value4', prop2: 'anothervalue4' }
])
    .pluck('prop1')
    .subscribe((streamItem: any) => {
        console.log(streamItem); // value1, value2, value3, value4
    });
```

This simple transformation will:

1. Create an Observable from an array of objects
2. "Pluck", or extract the value of prop1 for each object and send as stream 
3. Subscribe and print each plucked value to the console

It is crucial to understand "[marble diagrams](http://rxmarbles.com/)", which explain the flow of each operator.  Some noteworthy operators include: 

* [map](http://rxmarbles.com/#map) - transforms each piece of stream data (ex: multiply it by 2)
* [concatMap](http://rxmarbles.com/#concatMap)
* [pipe](https://stackoverflow.com/questions/50155590/use-rxjs-pipe-to-reduce-observable-to-different-type) - pipes two or more operators together, back to back and returns an observable you can subscribe to 
* [tap](https://www.learnrxjs.io/operators/utility/do.html) - an operator that allows you to do things with values between other operators