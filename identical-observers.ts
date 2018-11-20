import observable from "./simple-observable";

let runFile1 = () => {
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
}

export default runFile1;