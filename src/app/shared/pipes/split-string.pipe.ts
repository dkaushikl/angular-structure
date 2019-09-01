import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'splitString'
})

export class SplitString implements PipeTransform {
    transform(input: string, splitChar: string, splitIndex: number) {
        return input.split(splitChar)[splitIndex];
    }
}

