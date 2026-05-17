import { Component, OnInit } from '@angular/core';
import { PasswordService } from '../core/password.service';
import { UserService } from '../core/user.service';
import { initFlowbite } from 'flowbite';
import { Directory } from '../shared/models/directory';
import { DirectoryService } from '../core/directory.service';
import { RouterLink } from '@angular/router';
import ApexCharts from 'apexcharts';
import { SecurityReportService } from '../core/security-report.service';
import { SecurityReport } from '../shared/dto/SecurityReport';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-home',
  imports: [RouterLink,NgIf],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit{
  totalPasswords = 0;
  favoritePasswordCount: number = 0;
  userDirectories!: Directory[];
  securityTip: string = '';

  constructor(
    private passwordService: PasswordService,
    private userService: UserService,
    private directoryService: DirectoryService,
    private reportService: SecurityReportService
  ) {}

  private tips: string[] = [
    "Never reuse passwords across multiple sites.",
    "Use long passwords with letters, numbers, and symbols.",
    "Avoid storing passwords in mobile notes.",
    "Change your most important passwords every 6 months.",
    "Don't use personal information (like birthdays) in your passwords.",
    "Don't share your passwords via messages or emails.",
    "Use a secure password manager.",
    "Avoid public Wi-Fi networks when accessing sensitive accounts.",
    "Enable suspicious login alerts whenever possible."
  ];
  

  ngOnInit(): void {
    this.loadUserDirectories();
    this.loadTotalPasswords();
    this.loadTotalFavorites();
    this.setRandomSecurityTip();
    this.loadPasswordStrengthChart();
  }


  loadTotalPasswords(): void {
    this.userService.getByToken().subscribe(user => {
      this.passwordService.getPasswordsByUserId(user.id).subscribe(passwords => {
        this.totalPasswords = passwords.length;
      });
    });
  }

  loadTotalFavorites():void{
    this.userService.getByToken().subscribe(user => {
      this.passwordService.getFavoriteCountByUserId(user.id).subscribe(count => {
        this.favoritePasswordCount = count;
      });
    });
  }

  loadUserDirectories(): void {
    this.userService.getByToken().subscribe(user => {
      this.directoryService.getByUserId(user.id).subscribe({
        next: (dirs) => {
          this.userDirectories = dirs;
          setTimeout(() => {initFlowbite();}, 100);},
        error: (err) => console.error('Error al obtener directorios del usuario', err)
      });
    });
  }
  
  setRandomSecurityTip(): void {
    const index = Math.floor(Math.random() * this.tips.length);
    this.securityTip = this.tips[index];
  }

  private loadPasswordStrengthChart(): void {
    this.userService.getIdUserByToken().subscribe({
      next: (userId: number) => {
        this.reportService.getReportByUserId(userId).subscribe({
          next: (report: SecurityReport) => {
            const total = report.totalPasswords ?? 0;
            if (total === 0) return;
  
            const weak = report.weakPasswords?.length || 0;
            const repeated = report.repeatedPasswords?.length || 0;
            const safe = total - weak - repeated;
  
            const chartOptions = this.getChartOptions([weak, repeated, safe]);
            const chartElement = document.querySelector("#pie-chart");
  
            if (chartElement && typeof ApexCharts !== 'undefined') {
              const chart = new ApexCharts(chartElement, chartOptions);
              chart.render();
            }
          },
          error: (err) => {
            console.error('Error fetching security report:', err);
          }
        });
      },
      error: (err) => {
        console.error('Error getting user ID from token:', err);
      }
    });
  }
  
  private getChartOptions(data: number[]) {
    return {
      series: data,
      colors: ["#EF4444", "#F59E0B", "#10B981"],
      chart: {
        height: 420,
        width: "100%",
        type: "pie",
      },
      labels: ["Weak Passwords", "Repeated Passwords", "Safe Passwords"],
      stroke: {
        colors: ["white"],
      },
      plotOptions: {
        pie: {
          size: "100%",
          dataLabels: {
            offset: -25
          }
        }
      },
      dataLabels: {
        enabled: true,
        style: {
          fontFamily: "Inter, sans-serif",
        },
      },
      legend: {
        position: "bottom",
        fontFamily: "Inter, sans-serif",
      },
    };
  }
}
