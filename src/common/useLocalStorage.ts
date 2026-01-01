import { useEffect, useState } from "react";
import { isFunction } from "./utils";

export function useLocalStorage<T = any>(key: string, defaultValue: T | any) {
    const [value, setValue] = useState<T>(() => {
        try {
            const storedValue = localStorage.getItem(key);
            return storedValue ? JSON.parse(storedValue) : isFunction(defaultValue) ? defaultValue() : defaultValue;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return isFunction(defaultValue) ? defaultValue() : defaultValue;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error writing to localStorage:', error);
        }
    }, [key, value]);

    const reset = () => {
        setValue(isFunction(defaultValue) ? defaultValue() : defaultValue);
    }

    return [value, setValue, reset];
};