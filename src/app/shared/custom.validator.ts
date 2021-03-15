import { FormArray, ValidationErrors, ValidatorFn } from "@angular/forms";

export class CustomValidator {
  static sizeValidatorFn(): ValidatorFn  {
    return function (array: FormArray): { [key: string]: any } | null {
      return array.length > 0 ? null : {
        invalidSize: true
      };
    }
  }

  static rangeValidatorFn(smallerControlName: string, biggerControlName: string): ValidatorFn {
    return function (array: FormArray): ValidationErrors | null {
      const invalidGroups = array.value.filter(group => {
        if (group[smallerControlName] === null || group[biggerControlName] === null) {
          return true;
        }
        if (group[smallerControlName] >= group[biggerControlName]) {
          return true;
        }
        return false;
      });

      return invalidGroups.length === 0 ? null : {
        invalidRange: true
      };
    }
  }
}
