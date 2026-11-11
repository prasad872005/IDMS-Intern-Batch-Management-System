import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  FormsModule,
  Validators
} from '@angular/forms';

import { IdmsService } from './idms.service';
import { Batch, Intern, CardType, InternPayload } from './models';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    MatSnackBarModule
  ],
  template: `
<div class="shell">
  <aside class="sidebar">
    <div class="brand">
      <div class="brand-mark">ID</div>
      <div>
        <b>IDMS</b>
        <small>Intern Management</small>
      </div>
    </div>

    <div class="nav-label">WORKSPACE</div>

    <button class="nav-item" [class.active]="tab==='overview'" (click)="tab='overview'">
      <mat-icon>space_dashboard</mat-icon> Overview
    </button>

    <button class="nav-item" [class.active]="tab==='interns'" (click)="tab='interns'">
      <mat-icon>groups</mat-icon> Interns
    </button>

    <button class="nav-item" [class.active]="tab==='batches'" (click)="tab='batches'">
      <mat-icon>calendar_month</mat-icon> Batches
    </button>

    <div class="side-note">
      <mat-icon>lightbulb</mat-icon>
      <b>Stay organized</b>
      <p>Manage your interns and training batches in one place.</p>
    </div>

    <div class="sidebar-foot">IDMS · Month 3 Project</div>
  </aside>

  <main class="main">
    <header class="topbar">
      <div>
        <span class="eyebrow">WORKSPACE / {{tab | uppercase}}</span>
        <h1>
          {{tab==='overview'?'Dashboard':tab==='interns'?'Intern Management':'Batch Management'}}
        </h1>
      </div>

      <div class="top-user">
        <div class="avatar">AD</div>
        <div>
          <b>Administrator</b>
          <small>Workspace admin</small>
        </div>
      </div>
    </header>

    <!-- OVERVIEW -->
    <section *ngIf="tab==='overview'" class="content">
      <div class="welcome">
        <div>
          <span class="eyebrow light">INTERN & BATCH DATA MANAGEMENT</span>
          <h2>Good work starts with<br>great organization.</h2>
          <p>Keep track of your interns, batches and ID cards from one dashboard.</p>
        </div>
        <div class="welcome-icon">
          <mat-icon>groups_2</mat-icon>
        </div>
      </div>

      <div class="stats">
        <div class="stat-card">
          <div class="stat-icon purple"><mat-icon>groups</mat-icon></div>
          <span>Total interns</span>
          <strong>{{interns.length}}</strong>
          <small>Registered in the system</small>
        </div>

        <div class="stat-card">
          <div class="stat-icon blue"><mat-icon>calendar_month</mat-icon></div>
          <span>Total batches</span>
          <strong>{{batches.length}}</strong>
          <small>Training groups created</small>
        </div>

        <div class="stat-card">
          <div class="stat-icon green"><mat-icon>workspace_premium</mat-icon></div>
          <span>Premium cards</span>
          <strong>{{premiumCount}}</strong>
          <small>Premium ID card holders</small>
        </div>

        <div class="stat-card">
          <div class="stat-icon orange"><mat-icon>badge</mat-icon></div>
          <span>Free cards</span>
          <strong>{{freeCount}}</strong>
          <small>Free ID card holders</small>
        </div>
      </div>

      <div class="panel">
        <div class="panel-head">
          <div>
            <h3>Recent interns</h3>
            <p>Latest registrations in your workspace</p>
          </div>
          <button mat-stroked-button (click)="tab='interns'">
            View all <mat-icon>arrow_forward</mat-icon>
          </button>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>INTERN</th>
                <th>INTERN ID</th>
                <th>BATCH</th>
                <th>CARD TYPE</th>
                <th>JOINING DATE</th>
              </tr>
            </thead>

            <tbody>
              <tr *ngFor="let x of interns.slice(0,5)">
                <td><b>{{x.name}}</b><small>{{x.email}}</small></td>
                <td class="mono">{{x.internId}}</td>
                <td>{{getBatchLabel(x.batchId)}}</td>
                <td>
                  <span class="pill" [class.premium]="x.cardType==='PREMIUM'">
                    {{x.cardType}}
                  </span>
                </td>
                <td>{{x.dateOfJoining | date:'mediumDate'}}</td>
              </tr>

              <tr *ngIf="!interns.length">
                <td colspan="5" class="empty">
                  No interns yet. Add your first intern from Intern Management.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- INTERN MANAGEMENT -->
    <section *ngIf="tab==='interns'" class="content">
      <div class="section-head">
        <div>
          <h2>All interns</h2>
          <p>Register, update and manage intern records.</p>
        </div>
        <button mat-flat-button color="primary" (click)="openInternForm()">
          <mat-icon>add</mat-icon> Add intern
        </button>
      </div>

      <!-- INTERN FORM -->
      <div class="panel" *ngIf="showInternForm">
        <div class="panel-head">
          <div>
            <h3>{{editing?'Update intern':'Register new intern'}}</h3>
            <p>Intern ID is generated automatically and cannot be edited.</p>
          </div>
          <button mat-icon-button (click)="showInternForm=false">
            <mat-icon>close</mat-icon>
          </button>
        </div>

        <form [formGroup]="internForm" (ngSubmit)="saveIntern()" class="form-grid">
          <mat-form-field appearance="outline">
            <mat-label>Full name</mat-label>
            <input matInput formControlName="name" placeholder="Enter full name">
            <mat-error>Name is required</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Email address</mat-label>
            <input matInput formControlName="email" placeholder="name@example.com">
            <mat-error>Enter a valid email</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Mobile number</mat-label>
            <input matInput formControlName="mobileNumber" placeholder="10-digit mobile number">
            <mat-error>Enter a valid 10–15 digit number</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>ID card type</mat-label>
            <mat-select formControlName="cardType">
              <mat-option value="FREE">Free</mat-option>
              <mat-option value="PREMIUM">Premium</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Date of joining</mat-label>
            <input matInput [matDatepicker]="joinPicker" formControlName="dateOfJoining">
            <mat-datepicker-toggle matIconSuffix [for]="joinPicker"></mat-datepicker-toggle>
            <mat-datepicker #joinPicker></mat-datepicker>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Assign to batch</mat-label>
            <mat-select formControlName="batchId">
              <mat-option *ngFor="let b of batches" [value]="b.id">
                {{b.batchName || 'Batch #' + b.id}} · {{b.startDate | date:'mediumDate'}}
              </mat-option>
            </mat-select>
            <mat-error>Batch assignment is required</mat-error>
          </mat-form-field>

          <div class="form-actions">
            <button mat-button type="button" (click)="showInternForm=false">
              Cancel
            </button>
            <button mat-flat-button color="primary" type="submit">
              {{editing?'Save changes':'Register intern'}}
            </button>
          </div>
        </form>
      </div>

      <!-- INTERN SEARCH AND FILTER -->
      <div class="panel">
        <div class="filters">
          <mat-form-field appearance="outline" class="search">
            <mat-label>Search interns</mat-label>
            <input
              matInput
              [(ngModel)]="search"
              (ngModelChange)="loadInterns()"
              [ngModelOptions]="{standalone:true}"
              placeholder="Name, email or intern ID">
            <mat-icon matPrefix>search</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Batch</mat-label>
            <mat-select [(ngModel)]="filterBatch" (selectionChange)="loadInterns()">
              <mat-option [value]="null">All batches</mat-option>
              <mat-option *ngFor="let b of batches" [value]="b.id">
                {{b.batchName || 'Batch #' + b.id}}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Card type</mat-label>
            <mat-select [(ngModel)]="filterCard" (selectionChange)="loadInterns()">
              <mat-option value="">All types</mat-option>
              <mat-option value="FREE">Free</mat-option>
              <mat-option value="PREMIUM">Premium</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>INTERN</th>
                <th>INTERN ID</th>
                <th>MOBILE</th>
                <th>BATCH</th>
                <th>CARD TYPE</th>
                <th>JOINING DATE</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              <tr *ngFor="let x of interns">
                <td><b>{{x.name}}</b><small>{{x.email}}</small></td>
                <td class="mono">{{x.internId}}</td>
                <td>{{x.mobileNumber}}</td>
                <td>{{getBatchLabel(x.batchId)}}</td>
                <td>
                  <span class="pill" [class.premium]="x.cardType==='PREMIUM'">
                    {{x.cardType}}
                  </span>
                </td>
                <td>{{x.dateOfJoining | date:'mediumDate'}}</td>
                <td class="actions">
                  <button mat-icon-button aria-label="Edit" (click)="editIntern(x)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" aria-label="Delete" (click)="removeIntern(x)">
                    <mat-icon>delete_outline</mat-icon>
                  </button>
                  <button mat-icon-button
                          aria-label="View ID card"
                          title="View ID card"
                          (click)="viewIdCard(x)">
                    <mat-icon>badge</mat-icon>
                  </button>
                  <button mat-icon-button
                          aria-label="Download ID card PDF"
                          title="Download ID card PDF"
                          (click)="downloadIdCard(x)">
                    <mat-icon>download</mat-icon>
                  </button>
                </td>
              </tr>

              <tr *ngIf="!interns.length">
                <td colspan="7" class="empty">No matching interns found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ID CARD PREVIEW -->
      <div class="id-modal-backdrop" *ngIf="selectedCard"
           (click)="selectedCard = null">
        <div class="id-modal" (click)="$event.stopPropagation()">
          <div class="id-modal-heading">
            <div>
              <h3>Intern ID Card</h3>
              <p>Preview your {{selectedCard.cardType}} ID card</p>
            </div>
            <button mat-icon-button (click)="selectedCard = null">
              <mat-icon>close</mat-icon>
            </button>
          </div>

          <div class="id-card"
               [class.premium-card]="selectedCard.cardType === 'PREMIUM'">
            <div class="id-card-header">
              <div class="id-logo">ID</div>
              <div>
                <strong>IDMS</strong>
                <small>INTERN MANAGEMENT SYSTEM</small>
              </div>
              <span>{{selectedCard.cardType}}</span>
            </div>

            <div class="id-card-body">
              <div class="id-avatar">
                {{selectedCard.name.charAt(0).toUpperCase()}}
              </div>
              <div class="id-details">
                <h2>{{selectedCard.name}}</h2>
                <p class="id-number">{{selectedCard.internId}}</p>
                <p>{{selectedCard.email}}</p>
                <p>{{selectedCard.mobileNumber}}</p>
                <p>Batch: {{getBatchLabel(selectedCard.batchId)}}</p>
                <p>Joined: {{selectedCard.dateOfJoining | date:'mediumDate'}}</p>
              </div>
            </div>

            <div class="id-card-footer">
              <span>OFFICIAL INTERN IDENTITY CARD</span>
              <span>{{selectedCard.cardType}}</span>
            </div>
          </div>

          <div class="id-modal-actions">
            <button mat-button (click)="selectedCard = null">
              Close
            </button>
            <button mat-flat-button color="primary"
                    (click)="downloadIdCard(selectedCard)">
              <mat-icon>download</mat-icon>
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </section>

        <!-- BATCH MANAGEMENT -->
    <section *ngIf="tab==='batches'" class="content">
      <div class="section-head">
        <div>
          <h2>Training batches</h2>
          <p>Create batches and review assigned interns.</p>
        </div>
        <button mat-flat-button color="primary" (click)="showBatchForm=!showBatchForm">
          <mat-icon>add</mat-icon> Create batch
        </button>
      </div>

      <!-- CREATE BATCH FORM -->
      <div class="panel" *ngIf="showBatchForm">
        <div class="panel-head">
          <div>
            <h3>Create a new batch</h3>
            <p>End date is automatically set six months after the start date.</p>
          </div>
        </div>

        <form [formGroup]="batchForm" (ngSubmit)="saveBatch()" class="batch-form">
          <mat-form-field appearance="outline">
            <mat-label>Batch name</mat-label>
            <input
              matInput
              formControlName="batchName"
              placeholder="Example: Java Full Stack 2027">
            <mat-error>Batch name is required</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Batch start date</mat-label>
            <input
              matInput
              [matDatepicker]="batchPicker"
              formControlName="startDate">
            <mat-datepicker-toggle matIconSuffix [for]="batchPicker"></mat-datepicker-toggle>
            <mat-datepicker #batchPicker></mat-datepicker>
          </mat-form-field>

          <div class="date-preview">
            <small>Calculated end date</small>
            <b>{{batchEndPreview}}</b>
          </div>

          <button
            mat-flat-button
            color="primary"
            type="submit"
            [disabled]="batchForm.invalid">
            Create batch
          </button>
        </form>
      </div>

      <!-- BATCH CARDS -->
      <div class="batch-grid">
        <article class="batch-card" *ngFor="let b of batches">
          <div class="batch-top">
            <div class="batch-symbol">
              <mat-icon>calendar_month</mat-icon>
            </div>
            <span class="pill active-pill">ACTIVE</span>
          </div>

          <h3>{{b.batchName || 'Batch #' + b.id}}</h3>
          <small>Batch ID: {{b.id}}</small>

          <p class="batch-dates">
            {{b.startDate | date:'mediumDate'}} –
            {{b.endDate | date:'mediumDate'}}
          </p>

          <div class="batch-meta">
            <div>
              <strong>{{b.internCount}}</strong>
              <small>Interns assigned</small>
            </div>
            <button mat-stroked-button (click)="viewBatch(b)">
              View interns
            </button>
          </div>

          <button
            class="delete-batch"
            mat-button
            color="warn"
            (click)="removeBatch(b)">
            <mat-icon>delete_outline</mat-icon> Delete batch
          </button>
        </article>

        <div class="empty-card" *ngIf="!batches.length">
          <mat-icon>event_note</mat-icon>
          <b>No batches created</b>
          <p>Create a batch before registering interns.</p>
        </div>
      </div>

      <!-- BATCH INTERN DETAILS -->
      <div class="panel" *ngIf="selectedBatch">
        <div class="panel-head">
          <div>
            <h3>
              {{selectedBatch.batchName || 'Batch #' + selectedBatch.id}}
              · Intern overview
            </h3>
            <p>
              {{selectedBatch.startDate | date:'mediumDate'}}
              to {{selectedBatch.endDate | date:'mediumDate'}}
              · {{batchInterns.length}} interns
            </p>
          </div>

          <button mat-icon-button (click)="selectedBatch=null">
            <mat-icon>close</mat-icon>
          </button>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>NAME</th>
                <th>INTERN ID</th>
                <th>EMAIL</th>
                <th>CARD TYPE</th>
                <th>JOINING DATE</th>
              </tr>
            </thead>

            <tbody>
              <tr *ngFor="let x of batchInterns">
                <td>{{x.name}}</td>
                <td class="mono">{{x.internId}}</td>
                <td>{{x.email}}</td>
                <td>{{x.cardType}}</td>
                <td>{{x.dateOfJoining | date:'mediumDate'}}</td>
              </tr>

              <tr *ngIf="!batchInterns.length">
                <td colspan="5" class="empty">
                  No interns assigned to this batch.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <footer>
      © 2026 IDMS · Intern & Batch Data Management System
      <span>Built with Spring Boot & Angular</span>
    </footer>
  </main>
</div>
`
})
export class AppComponent implements OnInit {
  private api = inject(IdmsService);
  private fb = inject(FormBuilder);
  private snack = inject(MatSnackBar);

  tab = 'overview';

  interns: Intern[] = [];
  batches: Batch[] = [];
  batchInterns: Intern[] = [];

  selectedBatch: Batch | null = null;
  selectedCard: Intern | null = null;

  showInternForm = false;
  showBatchForm = false;

  editing: Intern | null = null;

  search = '';
  filterBatch: number | null = null;
  filterCard: CardType | '' = '';

  // INTERN FORM
  internForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    mobileNumber: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{10,15}$/)]],
    cardType: ['FREE' as CardType, Validators.required],
    dateOfJoining: [new Date(), Validators.required],
    batchId: [null as number | null, Validators.required]
  });

  // BATCH FORM
  batchForm = this.fb.group({
    batchName: ['', [Validators.required, Validators.maxLength(100)]],
    startDate: [new Date(), Validators.required]
  });

  get premiumCount() {
    return this.interns.filter(x => x.cardType === 'PREMIUM').length;
  }

  get freeCount() {
    return this.interns.filter(x => x.cardType === 'FREE').length;
  }

  // AUTOMATIC END DATE PREVIEW
  get batchEndPreview() {
    const d = this.batchForm.value.startDate;

    if (!d) return '—';

    const x = new Date(d);
    x.setMonth(x.getMonth() + 6);

    return x.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.api.getBatches().subscribe({
      next: x => this.batches = x,
      error: e => this.fail(e)
    });

    this.loadInterns();
  }

  loadInterns() {
    this.api.getInterns(this.search, this.filterBatch, this.filterCard)
      .subscribe({
        next: x => this.interns = x,
        error: e => this.fail(e)
      });
  }

  getBatchLabel(batchId: number) {
    const batch = this.batches.find(b => b.id === batchId);
    return batch?.batchName || `Batch #${batchId}`;
  }

  // OPEN INTERN FORM
  openInternForm() {
    if (!this.batches.length) {
      this.notify('Create a batch before registering an intern.');
      this.tab = 'batches';
      return;
    }

    this.editing = null;

    this.internForm.reset({
      name: '',
      email: '',
      mobileNumber: '',
      cardType: 'FREE',
      dateOfJoining: new Date(),
      batchId: this.batches[0].id
    });

    this.showInternForm = true;
  }

  // EDIT INTERN
  editIntern(x: Intern) {
    this.editing = x;

    this.internForm.reset({
      name: x.name,
      email: x.email,
      mobileNumber: x.mobileNumber,
      cardType: x.cardType,
      dateOfJoining: new Date(x.dateOfJoining + 'T00:00:00'),
      batchId: x.batchId
    });

    this.showInternForm = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // SAVE INTERN
  saveIntern() {
    if (this.internForm.invalid) {
      this.internForm.markAllAsTouched();
      return;
    }

    const v = this.internForm.getRawValue();

    const payload: InternPayload = {
      name: v.name!,
      email: v.email!,
      mobileNumber: v.mobileNumber!,
      cardType: v.cardType!,
      dateOfJoining: this.date(v.dateOfJoining!),
      batchId: v.batchId!
    };

    const req = this.editing
      ? this.api.updateIntern(this.editing.id, payload)
      : this.api.createIntern(payload);

    req.subscribe({
      next: x => {
        this.notify(
          this.editing
            ? 'Intern updated successfully'
            : `Intern registered: ${x.internId}`
        );

        this.showInternForm = false;
        this.editing = null;
        this.refresh();
      },
      error: e => this.fail(e)
    });
  }

    // VIEW INTERN ID CARD
  viewIdCard(x: Intern) {
    this.selectedCard = x;
  }

  // DOWNLOAD INTERN ID CARD AS PDF
  downloadIdCard(x: Intern) {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [85, 54]
    });

    const isPremium = x.cardType === 'PREMIUM';

    const primary: [number, number, number] = isPremium
      ? [25, 35, 65]
      : [35, 105, 190];

    const accent: [number, number, number] = isPremium
      ? [220, 180, 75]
      : [80, 170, 235];

    // Card background and border
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 85, 54, 'F');

    doc.setDrawColor(accent[0], accent[1], accent[2]);
    doc.setLineWidth(1);
    doc.roundedRect(1, 1, 83, 52, 2, 2, 'S');

    // Header
    doc.setFillColor(primary[0], primary[1], primary[2]);
    doc.rect(1, 1, 83, 14, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.text('IDMS', 6, 8);

    doc.setFontSize(6);
    doc.text('INTERN MANAGEMENT SYSTEM', 6, 12);

    doc.setFontSize(7);
    doc.text(`${x.cardType} ID CARD`, 79, 9, { align: 'right' });

    // Intern details
    doc.setTextColor(30, 40, 55);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);

    const nameLines = doc.splitTextToSize(x.name, 48);
    doc.text(nameLines.slice(0, 2), 6, 23);

    doc.setFontSize(8);
    doc.text(`ID: ${x.internId}`, 6, 32);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text(`Email: ${x.email}`, 6, 37);
    doc.text(`Mobile: ${x.mobileNumber}`, 6, 41);
    doc.text(`Batch: ${this.getBatchLabel(x.batchId)}`, 6, 45);

    const joiningDate = new Date(`${x.dateOfJoining}T00:00:00`)
      .toLocaleDateString('en-IN');

    doc.text(`Joining Date: ${joiningDate}`, 6, 49);

    // Bottom strip
    doc.setFillColor(primary[0], primary[1], primary[2]);
    doc.rect(1, 51, 83, 2, 'F');

    const safeId = x.internId.replace(/[^a-zA-Z0-9_-]/g, '_');
    doc.save(`${safeId}-${x.cardType}-ID-Card.pdf`);
  }

  // DELETE INTERN
  removeIntern(x: Intern) {
    if (!confirm(`Delete ${x.name} (${x.internId})?`)) return;

    this.api.deleteIntern(x.id).subscribe({
      next: () => {
        this.notify('Intern deleted');
        this.refresh();
      },
      error: e => this.fail(e)
    });
  }

  // CREATE BATCH
  saveBatch() {
    if (this.batchForm.invalid) {
      this.batchForm.markAllAsTouched();
      return;
    }

    const batchName = this.batchForm.value.batchName!.trim();
    const startDate = this.date(this.batchForm.value.startDate!);

    if (!batchName) {
      this.notify('Please enter a batch name.');
      return;
    }

    this.api.createBatch(batchName, startDate).subscribe({
      next: b => {
        this.notify(
          `${b.batchName} created successfully. Batch ID: ${b.id}`
        );

        this.showBatchForm = false;

        this.batchForm.reset({
          batchName: '',
          startDate: new Date()
        });

        this.refresh();
      },
      error: e => this.fail(e)
    });
  }

  // VIEW BATCH INTERNS
  viewBatch(b: Batch) {
    this.selectedBatch = b;

    this.api.getBatchInterns(b.id).subscribe({
      next: x => this.batchInterns = x,
      error: e => this.fail(e)
    });
  }

  // DELETE BATCH
  removeBatch(b: Batch) {
    if (!confirm(`Delete ${b.batchName || 'Batch #' + b.id}? Only empty batches can be deleted.`)) {
      return;
    }

    this.api.deleteBatch(b.id).subscribe({
      next: () => {
        this.notify('Batch deleted');
        this.refresh();
      },
      error: e => this.fail(e)
    });
  }

  // DATE FORMAT
  date(v: Date | string) {
    const d = new Date(v);

    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  notify(m: string) {
    this.snack.open(m, 'Close', { duration: 3500 });
  }

  fail(e: any) {
    this.notify(
      e?.error?.message ||
      'Something went wrong. Check that the backend and database are running.'
    );
  }
}
