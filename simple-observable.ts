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