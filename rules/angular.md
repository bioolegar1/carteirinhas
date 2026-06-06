# Angular 21

## Versão e Configuração

Utilize Angular 21 com standalone components como padrão. Evite NgModules quando possível.

**Exemplo:**
```typescript
// ✅ Prefira standalone components (Angular 21)
@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent {
  // ...
}

// ❌ Evite - NgModules desnecessários
@NgModule({
  declarations: [UserListComponent],
  imports: [CommonModule],
})
export class UserListModule {}
```

## Nomenclatura

Use PascalCase para classes, kebab-case para seletores e arquivos.

**Exemplo:**
```typescript
// ✅ Correto
// user-list.component.ts
@Component({
  selector: 'app-user-list',
})
export class UserListComponent {}

// user.service.ts
@Injectable({ providedIn: 'root' })
export class UserService {}

// user.model.ts
export interface User {
  id: number;
  name: string;
}

// ❌ Evite
// UserList.ts
// userservice.ts
```

## Componentes

Use standalone components, signals e `ChangeDetectionStrategy.OnPush` como padrão.

**Exemplo:**
```typescript
// ✅ Prefira OnPush e signals (Angular 21)
@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card">
      <h3>{{ user().name }}</h3>
      <p>{{ user().email }}</p>
    </div>
  `,
})
export class UserCardComponent {
  // Input com signal (Angular 21)
  readonly user = input.required<User>();
  
  // Output com signal (Angular 21)
  readonly onDelete = output<void>();
  
  // Injeção via inject() (Angular 14+)
  private readonly userService = inject(UserService);
  
  delete(): void {
    this.onDelete.emit();
  }
}

// ❌ Evite - Input/Output antigo
@Input() user!: User;
@Output() onDelete = new EventEmitter<void>();
```

## Services

Use providedIn: 'root' e injeção via inject().

**Exemplo:**
```typescript
// ✅ Prefira
@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly signalR = inject(SignalRService);
  
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users');
  }
  
  getUser(id: number): Observable<User> {
    return this.http.get<User>(`/api/users/${id}`);
  }
  
  createUser(user: CreateUserRequest): Observable<User> {
    return this.http.post<User>('/api/users', user);
  }
}

// ❌ Evite - constructor injection antigo
@Injectable()
export class UserService {
  constructor(
    private http: HttpClient,
    private signalR: SignalRService
  ) {}
}
```

## RxJS

Use operators apropriados e sempre faça unsubscribe com takeUntilDestroyed ou async pipe.

**Exemplo:**
```typescript
// ✅ Prefira - async pipe e takeUntilDestroyed
@Component({
  template: `
    @for (user of users$ | async; track user.id) {
      <app-user-card [user]="user" />
    }
  `,
})
export class UserListComponent {
  readonly users$ = inject(UserService).getUsers();
  
  constructor() {
    inject(UserService).getUsers()
      .pipe(takeUntilDestroyed())
      .subscribe(users => console.log(users));
  }
}

// ✅ Use operators apropriados
search(term: string): Observable<User[]> {
  return this.searchSubject.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(term => this.userService.search(term)),
    catchError(() => of([])),
  );
}

// ❌ Evite - subscribe manual sem unsubscribe
ngOnInit() {
  this.userService.getUsers().subscribe(users => {
    this.users = users;
  });
}
```

## HTTP Client

Use interceptors funcionais (Angular 21) para tratamento global de erros e auth.

**Exemplo:**
```typescript
// Auth interceptor (functional, Angular 21)
@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptorFn {
  intercept(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const authService = inject(AuthService);
    const token = authService.getToken();
    
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    
    return next(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          inject(Router).navigate(['/login']);
        }
        return throwError(() => error);
      }),
    );
  }
}

// Config no app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
  ],
};
```

## Forms

Use Reactive Forms com tipagem forte e typed forms (Angular 14+).

**Exemplo:**
```typescript
// ✅ Typed forms (Angular 14+)
@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <input formControlName="name" />
      <input formControlName="email" type="email" />
      <input formControlName="age" type="number" />
      <button type="submit" [disabled]="form.invalid">Save</button>
    </form>
  `,
})
export class UserFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  
  // nonNullable para tipos precisos (Angular 14+)
  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    age: [null as number | null, [Validators.required, Validators.min(18)]],
  });
  
  onSubmit(): void {
    if (this.form.valid) {
      this.userService.createUser(this.form.getRawValue())
        .pipe(takeUntilDestroyed())
        .subscribe(() => this.router.navigate(['/users']));
    }
  }
}
```

## Roteamento

Use lazy loading com loadComponent e provideRouter (Angular 15+).

**Exemplo:**
```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full',
  },
  {
    path: 'users',
    loadComponent: () => 
      import('./users/user-list.component').then(m => m.UserListComponent),
    children: [
      {
        path: 'create',
        loadComponent: () => 
          import('./users/user-form.component').then(m => m.UserFormComponent),
      },
      {
        path: ':id',
        loadComponent: () => 
          import('./users/user-detail.component').then(m => m.UserDetailComponent),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () => 
      import('./not-found.component').then(m => m.NotFoundComponent),
  },
];

// Config (Angular 15+)
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
  ],
};
```

## Signals

Use signals como padrão para estado reativo (Angular 16+).

**Exemplo:**
```typescript
// ✅ Use signals para estado local (Angular 16+)
@Component({
  selector: 'app-counter',
  standalone: true,
  template: `
    <p>Count: {{ count() }}</p>
    <button (click)="increment()">+</button>
  `,
})
export class CounterComponent {
  readonly count = signal(0);
  
  increment(): void {
    this.count.update(c => c + 1);
  }
}

// ✅ Computed signals
@Component({
  selector: 'app-user-list',
  standalone: true,
  template: `
    <p>Active users: {{ activeCount() }}</p>
  `,
})
export class UserListComponent {
  readonly users = signal<User[]>([]);
  readonly activeCount = computed(() => 
    this.users().filter(u => u.active).length
  );
}

// ✅ Effects para side effects (Angular 16+)
ngOnInit(): void {
  effect(() => {
    console.log('User selected:', selectedUser());
  });
}

// ✅ linkedSignal para signals derivados com cleanup (Angular 21)
readonly userData = linkedSignal(() => loadUser(this.userId()));
```

## Controle de Fluxo (Angular 21)

Use a nova sintaxe de controle de fluxo (@if, @for, @switch).

**Exemplo:**
```typescript
// ✅ Nova sintaxe (Angular 21)
@Component({
  template: `
    @if (isLoading()) {
      <app-loading />
    } @else if (users().length > 0) {
      @for (user of users(); track user.id) {
        <app-user-card [user]="user" />
      } @empty {
        <p>No users found</p>
      }
    } @else {
      <app-empty-state />
    }
    
    @switch (status()) {
      @case ('active') {
        <span class="status-active">Active</span>
      }
      @case ('inactive') {
        <span class="status-inactive">Inactive</span>
      }
      @default {
        <span class="status-unknown">Unknown</span>
      }
    }
  `,
})
export class UserListComponent {
  readonly users = signal<User[]>([]);
  readonly isLoading = signal(false);
  readonly status = signal<'active' | 'inactive' | 'unknown'>('unknown');
}

// ❌ Evite - ngIf, ngFor antigos (ainda funcionam, mas nova sintaxe é preferida)
<div *ngIf="isLoading">Loading...</div>
<div *ngFor="let user of users">{{ user.name }}</div>
```

## Estilização

Use SCSS com BEM-like naming e CSS custom properties.

**Exemplo:**
```scss
// user-card.component.scss
.user-card {
  padding: var(--space-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-sm);
  }
  
  &__title {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-bold);
    color: var(--color-text-primary);
  }
  
  &__body {
    color: var(--color-text-secondary);
  }
  
  &--active {
    border-color: var(--color-success);
  }
}
```

## Testes

Use Jasmine/Karma ou Vitest (Angular 21+) com Testing Library.

**Exemplo:**
```typescript
describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let userService: jasmine.SpyObj<UserService>;
  
  beforeEach(async () => {
    userService = jasmine.createSpyObj('UserService', ['getUsers']);
    
    await TestBed.configureTestingModule({
      imports: [UserListComponent],
      providers: [
        { provide: UserService, useValue: userService },
      ],
    }).compileComponents();
    
    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should load users on init', () => {
    const mockUsers: User[] = [
      { id: 1, name: 'John', email: 'john@example.com' },
    ];
    userService.getUsers.and.returnValue(of(mockUsers));
    
    fixture.detectChanges();
    
    expect(userService.getUsers).toHaveBeenCalled();
  });
});
```

## Estrutura de Pastas

```
src/
├── app/
│   ├── app.component.ts
│   ├── app.config.ts
│   ├── app.routes.ts
│   ├── core/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   └── services/
│   ├── features/
│   │   ├── users/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   ├── models/
│   │   │   └── users.routes.ts
│   │   └── auth/
│   ├── shared/
│   │   ├── components/
│   │   ├── directives/
│   │   └── pipes/
│   └── layout/
├── assets/
├── environments/
└── styles/
    ├── _variables.scss
    ├── _mixins.scss
    └── styles.scss
```

## Server-Side Rendering (SSR) - Angular 21

Use SSR híbrido com hydration para melhor performance.

**Exemplo:**
```typescript
// app.config.server.ts
export const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideClientHydration(),
  ],
};

// Bootstrap
if (isPlatformBrowser(platform)) {
  bootstrapApplication(AppComponent, browserConfig);
} else {
  bootstrapApplication(AppComponent, serverConfig);
}
```

## Deferrable Views (Angular 21)

Use @defer para lazy loading de componentes pesados.

**Exemplo:**
```typescript
@Component({
  template: `
    @defer (on viewport) {
      <app-heavy-component />
    } @placeholder {
      <app-placeholder />
    } @loading {
      <app-loading-spinner />
    } @error {
      <app-error-message />
    }
  `,
})
export class DashboardComponent {}
```

## Features Angular 21

### linkedSignal (Angular 21)

```typescript
// Signal derivado com loading e cache automático
readonly userData = linkedSignal(() => loadUser(this.userId()), {
  loading: this.isLoading,
  error: this.error,
});
```

### resource (Angular 21)

```typescript
// Carregamento de dados reativo
readonly users = resource({
  request: () => ({ filter: this.filter() }),
  loader: (req) => this.userService.getUsers(req.filter),
});
```

### provideExperimentalZonelessChangeDetection (Angular 19+)

```typescript
// Zoneless change detection para melhor performance
export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes),
  ],
};
```
