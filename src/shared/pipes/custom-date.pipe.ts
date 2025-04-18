import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDate'
})
export class CustomDatePipe implements PipeTransform {

  transform(value: Date | string | number, format: 'date' | 'time' = 'date'): string {
    if (!value) {
      return '';
    }

    const date = new Date(value);

    if (format === 'date') {
      // Formats as day/month/year (e.g., 31/12/2025)
      return date.toLocaleDateString('ar-EG', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } else if (format === 'time') {
      // Get the current hours and minutes
      let hours = date.getHours();
      const minutes = date.getMinutes();

      // Determine the Arabic period indicator:
      // صباحا (morning) for AM, مساءا (evening) for PM.
      const period = hours < 12 ? 'صباحا' : 'مساءا';

      // Convert to 12-hour format:
      hours = hours % 12;
      if (hours === 0) {
        hours = 12;
      }

      // Format hours and minutes with 2-digits using Arabic locale.
      const formattedHours = hours.toLocaleString('ar-EG', { minimumIntegerDigits: 2 });
      const formattedMinutes = minutes.toLocaleString('ar-EG', { minimumIntegerDigits: 2 });

      return `${formattedHours}:${formattedMinutes} ${period}`;
    }

    return '';
  }
}
