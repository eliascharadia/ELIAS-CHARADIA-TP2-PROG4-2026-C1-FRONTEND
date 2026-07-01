import {
  Component, inject, signal,
  AfterViewInit, ViewChild, ElementRef, OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EstadisticasService } from '../../services/estadisticas.service';
import { ModalService } from '../../services//modal.service.ts';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-estadisticas',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-estadisticas.html',
  styleUrl: './dashboard-estadisticas.css',
})
export class DashboardEstadisticas implements AfterViewInit, OnDestroy {
  private estadisticasService = inject(EstadisticasService);
  private modalService = inject(ModalService);

  @ViewChild('chartBarras') chartBarrasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartLineas') chartLineasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartTorta') chartTortaRef!: ElementRef<HTMLCanvasElement>;

  desde = signal('');
  hasta = signal('');
  cargando = signal(false);

  private chartBarras: Chart | null = null;
  private chartLineas: Chart | null = null;
  private chartTorta: Chart | null = null;

  ngAfterViewInit(): void {
    // Fechas por defecto: último mes
    const hoy = new Date();
    const hace30dias = new Date();
    hace30dias.setDate(hoy.getDate() - 30);

    this.hasta.set(hoy.toISOString().split('T')[0]);
    this.desde.set(hace30dias.toISOString().split('T')[0]);

    this.cargarTodo();
  }

  ngOnDestroy(): void {
    this.destruirGraficos();
  }

  cargarTodo(): void {
    this.cargando.set(true);
    const desde = this.desde() || undefined;
    const hasta = this.hasta() || undefined;

    Promise.all([
      this.estadisticasService.publicacionesPorUsuario(desde, hasta).toPromise(),
      this.estadisticasService.comentariosPorTiempo(desde, hasta).toPromise(),
      this.estadisticasService.comentariosPorPublicacion(desde, hasta).toPromise(),
    ]).then(([pubPorUsuario, comPorTiempo, comPorPub]) => {
      this.cargando.set(false);
      this.destruirGraficos(); // destruir antes de recrear para evitar duplicados

      if (pubPorUsuario) this.crearGraficoBarras(pubPorUsuario);
      console.log(comPorPub);
      if (comPorTiempo) this.crearGraficoLineas(comPorTiempo);
      if (comPorPub) this.crearGraficoTorta(comPorPub);
    }).catch(() => {
      this.cargando.set(false);
      this.modalService.mostrar('Error al cargar las estadísticas.', 'error');
    });
  }

  private crearGraficoBarras(datos: any[]): void {
    if (!this.chartBarrasRef) return;

    this.chartBarras = new Chart(this.chartBarrasRef.nativeElement, {
      type: 'bar',
      data: {
        labels: datos.map((d) => `@${d.nombreUsuario}`),
        datasets: [{
          label: 'Publicaciones',
          data: datos.map((d) => d.cantidad),
          backgroundColor: 'rgba(195, 144, 62, 0.7)',
          borderColor: '#c3903e',
          borderWidth: 2,
          borderRadius: 6,
        }],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { labels: { color: '#fff' } },
          title: {
            display: true,
            text: 'Publicaciones por usuario',
            color: '#c3903e',
            font: { size: 16 },
          },
        },
        scales: {
          x: { ticks: { color: '#aaa' }, grid: { color: '#2a2a2a' } },
          y: {
            ticks: { color: '#aaa', stepSize: 1 },
            grid: { color: '#2a2a2a' },
            beginAtZero: true,
          },
        },
      },
    });
  }

  private crearGraficoLineas(datos: any[]): void {
    if (!this.chartLineasRef) return;

    this.chartLineas = new Chart(this.chartLineasRef.nativeElement, {
      type: 'line',
      data: {
        labels: datos.map((d) => d.fecha),
        datasets: [{
          label: 'Comentarios',
          data: datos.map((d) => d.cantidad),
          borderColor: '#6c5ce7',
          backgroundColor: 'rgba(108, 92, 231, 0.2)',
          borderWidth: 2,
          pointBackgroundColor: '#6c5ce7',
          tension: 0.4,
          fill: true,
        }],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { labels: { color: '#fff' } },
          title: {
            display: true,
            text: 'Comentarios por día',
            color: '#c3903e',
            font: { size: 16 },
          },
        },
        scales: {
          x: { ticks: { color: '#aaa' }, grid: { color: '#2a2a2a' } },
          y: {
            ticks: { color: '#aaa', stepSize: 1 },
            grid: { color: '#2a2a2a' },
            beginAtZero: true,
          },
        },
      },
    });
  }

  private crearGraficoTorta(datos: any[]): void {
    try {
    const colores = [
      '#c3903e', '#6c5ce7', '#00b894', '#e17055',
      '#0984e3', '#fd79a8', '#fdcb6e', '#55efc4',
    ];

    this.chartTorta = new Chart(this.chartTortaRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: datos.map((d) => d.titulo.length > 30 ? d.titulo.substring(0, 30) + '...' : d.titulo),
        datasets: [{
          data: datos.map((d) => d.cantidad),
          backgroundColor: datos.map((_, i) => colores[i % colores.length]),
          borderColor: '#1e1e1e',
          borderWidth: 2,
        }],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#fff', padding: 15 },
          },
          title: {
            display: true,
            text: 'Comentarios por publicación',
            color: '#c3903e',
            font: { size: 16 },
          },
        },
      },
    });
    console.log('gráfico torta creado:', this.chartTorta);
  } catch (error) {
    console.error('Error al crear gráfico torta:', error);
  }
  }

  private destruirGraficos(): void {
    this.chartBarras?.destroy();
    this.chartLineas?.destroy();
    this.chartTorta?.destroy();
    this.chartBarras = null;
    this.chartLineas = null;
    this.chartTorta = null;
  }
}