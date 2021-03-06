import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TimerService } from '../../services/timer/timer.service';
import { TimerWebWorkerService } from '../../services/timer-web-worker/timer-web-worker.service';

@Component({
  selector: 'app-controller',
  templateUrl: './controller.component.html',
  styleUrls: ['./controller.component.scss']
})
export class ControllerComponent implements OnInit, OnDestroy {
  ticks = 0;
  paused = true;
  subscriptions: Subscription[] = [];

  constructor(
    private timer: TimerService,
    private timerWW: TimerWebWorkerService,
  ) {}

  ngOnInit() {
    this.paused = this.timer.getPause();
    this.subscriptions.push(
      this.timerWW.TimerCounter.subscribe((ticks) => this.ticks = ticks),
      this.timer.PauseChecker.subscribe((paused) => this.paused = paused),
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  control(): void {
    this.paused ? this.start() : this.pause();
  }

  start(): void {
    this.timer.startTimer();
  }

  pause(): void {
    this.timer.updatePause(true);
  }

  save(): void {
    this.timer.addLabel(this.ticks);
  }

  stop(): void {
    this.timer.stopTimer();
  }
}
