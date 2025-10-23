import { Component } from '@angular/core';
import { CalendarEvent } from 'angular-calendar'

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css']
})
export class AgendaComponent {
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];

  ngOnInit(): void {
    this.generateWeeklyEvents();
  }

  generateWeeklyEvents(): void {
    const startOfMonth = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
    const endOfMonth = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 0);

    // Obtener los dos días aleatorios entre lunes (1) y viernes (5)
    const randomDays = this.getRandomWeekdays();

    for (let day = new Date(startOfMonth); day <= endOfMonth; day.setDate(day.getDate() + 1)) {
      if (randomDays.includes(day.getDay())) {
        this.events.push({
          start: new Date(day),
          title: 'Día presencial',
          color: {
            primary: '#1e90ff',
            secondary: '#D1E8FF',
          },
          draggable: true,
          resizable: {
            beforeStart: true,
            afterEnd: true,
          },
        });
      }
    }
  }

  private getRandomWeekdays(): number[] {
    const weekdays = [1, 2, 3, 4, 5]; // Lunes a Viernes
    const randomDays: number[] = [];

    while (randomDays.length < 2) {
      const randomDay = weekdays[Math.floor(Math.random() * weekdays.length)];
      if (!randomDays.includes(randomDay)) {
        randomDays.push(randomDay);
      }
    }

    return randomDays;
  }
}
