import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'splitOnCaps',
  standalone: true // Remove if not using standalone components
})
export class SplitOnCapsPipePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    return value
      // Add space between lowercase and uppercase letters
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      // Add space between uppercase letter followed by uppercase and lowercase
      .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');
  }
}
