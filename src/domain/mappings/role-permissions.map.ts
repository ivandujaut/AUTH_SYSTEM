import { Permission } from '../types/permissions';
import { Role } from '@prisma/client';

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.USER]: [
    Permission.VIEW_PROPERTIES,
    Permission.VIEW_PLACEMENT,
    Permission.INVEST,
    Permission.VIEW_MY_INVESTMENTS,
  ],
  [Role.MANAGER]: [
    Permission.VIEW_PROPERTIES,
    Permission.VIEW_PLACEMENT,
    Permission.VIEW_ALL_INVESTMENTS,
    Permission.VIEW_USERS,
  ],
  [Role.ADMIN]: [
    Permission.VIEW_PROPERTIES,
    Permission.VIEW_PLACEMENT,
    Permission.CREATE_PROPERTIES,
    Permission.MANAGE_PROPERTIES,
    Permission.CREATE_PLACEMENT,
    Permission.MANAGE_PLACEMENT,
    Permission.VIEW_ALL_INVESTMENTS,
    Permission.VIEW_USERS,
    Permission.MANAGE_USERS,
    Permission.UPDATE_NAV_PRICE,
  ],
};

/**
 👤 USER
Contexto: Cualquier persona que se registra en la plataforma para invertir en proyectos inmobiliarios tokenizados.

Acciones permitidas:
	•	Ver propiedades (proyectos).
	•	Ver información de la colocación (placement).
	•	Invertir en una colocación.
	•	Ver su portafolio de inversiones.

 
👨‍💼 ADMIN
Contexto: Cliente que contrata la plataforma para publicar proyectos y buscar financiamiento.

Acciones permitidas:
	•	Crear y administrar propiedades.
	•	Crear y administrar colocaciones.
	•	Ver todas las inversiones.
	•	Ver usuarios e inversionistas registrados.
	•	Bloquear usuarios (scope opcional).
	•	Asignar roles (scope opcional).
	•	Actualizar NAV de la propiedad.
 

📊 MANAGER
Contexto: Analista o stakeholder con permisos de lectura extendida, sin permisos de modificación.

Acciones permitidas:
	•	Ver todas las propiedades y sus datos.
	•	Ver todas las colocaciones activas.
	•	Ver inversiones totales de todos los usuarios.
	•	Generar reportes (scope externo).
 */
