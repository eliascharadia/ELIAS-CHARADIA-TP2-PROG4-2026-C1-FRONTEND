import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Modal } from './components/modal/modal';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Modal],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ELIAS-CHARADIA-TP2-PROG4-2026-C1-FRONTEND');
}
