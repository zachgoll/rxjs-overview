import observable from "./simple-observable";

let runFile2 = () => {
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
}

export default runFile2;

