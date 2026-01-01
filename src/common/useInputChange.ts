import { ChangeEvent } from "react";

export function useInputChange(setState: Function) {
    return (e: ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name;
        let value: any = e.target.value;

        switch (e.target.type) {
            case 'checkbox':
                value = e.target.checked;
                break;

            case 'number':
                value = e.target.valueAsNumber;
                break;

            case 'date':
                value = e.target.valueAsDate;
                break;
        }

        setState((prevState: any) => ({ ...prevState, [name]: value }));
    }
}