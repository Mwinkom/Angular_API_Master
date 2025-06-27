import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function noProfanityValidator (bannedWords: string[]): ValidatorFn{
    return (control: AbstractControl): ValidationErrors | null => {
        if(!control.value) return null;

        const value = control.value.toLowerCase();
        const hasProfanity = bannedWords.some( word => value.includes(word.toLowerCase()));

        return hasProfanity? {profanity: true} : null;
    };
}