import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Home } from "./components/home/home";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, Home],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {


}