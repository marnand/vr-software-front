import { Component } from '@angular/core';
import { NotificacaoComponent } from './notificacao/notificacao.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NotificacaoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'front-end';
}
