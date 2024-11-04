import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { SessionGuard } from './session.guard'; // Importa la clase SessionGuard

describe('SessionGuard', () => { // Cambia el nombre del describe para que coincida con la clase
  let guard: SessionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SessionGuard], // Asegúrate de proporcionar el guard aquí
    });
    guard = TestBed.inject(SessionGuard); // Inyecta el guard
  });

  it('should be created', () => {
    expect(guard).toBeTruthy(); // Verifica que el guard se haya creado
  });
});
