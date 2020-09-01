import {ValidatorFn, AbstractControl } from '@angular/forms';

export class MyValidators {

    static validateEmptyText(): ValidatorFn {
        return (control: AbstractControl): {[key: string]: boolean} | null => {
            let valid = control.value && (control.value as string).trim();
            return valid ? null : {emptyText: true};
        };
    }
}