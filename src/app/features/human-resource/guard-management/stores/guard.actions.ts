import { createActionGroup, props } from '@ngrx/store';
import {
  GuardDto, CreateGuardDto, UpdateGuardDto, GuardListParams, GuardPerformanceDto,
  GuardAssignmentDto, AssignGuardDto, TransferGuardDto, GuardStatusActionDto, EndAssignmentDto
} from '../models/guard.model';

export const GuardActions = createActionGroup({
  source: 'Guard',
  events: {
    'Load Guards': props<{ params?: GuardListParams }>(),
    'Load Guards Success': props<{ guards: GuardDto[]; totalRecords: number }>(),
    'Load Guards Failure': props<{ error: string }>(),

    'Load Guard': props<{ id: string }>(),
    'Load Guard Success': props<{ guard: GuardDto }>(),
    'Load Guard Failure': props<{ error: string }>(),

    'Create Guard': props<{ dto: CreateGuardDto }>(),
    'Create Guard Success': props<{ guard: GuardDto }>(),
    'Create Guard Failure': props<{ error: string }>(),

    'Update Guard': props<{ id: string; dto: UpdateGuardDto }>(),
    'Update Guard Success': props<{ guard: GuardDto }>(),
    'Update Guard Failure': props<{ error: string }>(),

    'Approve Guard': props<{ id: string }>(),
    'Approve Guard Success': props<{ guard: GuardDto }>(),
    'Approve Guard Failure': props<{ error: string }>(),

    'Reject Guard': props<{ id: string; reason?: string }>(),
    'Reject Guard Success': props<{ guard: GuardDto }>(),
    'Reject Guard Failure': props<{ error: string }>(),

    'Delete Guard': props<{ id: string }>(),
    'Delete Guard Success': props<{ id: string }>(),
    'Delete Guard Failure': props<{ error: string }>(),

    'Load Guard Performance': props<{ id: string }>(),
    'Load Guard Performance Success': props<{ performance: GuardPerformanceDto }>(),
    'Load Guard Performance Failure': props<{ error: string }>(),

    'Assign Guard': props<{ id: string; dto: AssignGuardDto }>(),
    'Assign Guard Success': props<{ assignment: GuardAssignmentDto }>(),
    'Assign Guard Failure': props<{ error: string }>(),

    'Transfer Guard': props<{ id: string; dto: TransferGuardDto }>(),
    'Transfer Guard Success': props<{ assignment: GuardAssignmentDto }>(),
    'Transfer Guard Failure': props<{ error: string }>(),

    'End Guard Assignment': props<{ id: string; dto: EndAssignmentDto }>(),
    'End Guard Assignment Success': props<{ id: string }>(),
    'End Guard Assignment Failure': props<{ error: string }>(),

    'Load Guard Assignments': props<{ id: string }>(),
    'Load Guard Assignments Success': props<{ assignments: GuardAssignmentDto[] }>(),
    'Load Guard Assignments Failure': props<{ error: string }>(),

    'Submit Performance Review': props<{ id: string; dto: { notes: string; disciplinaryActions: number } }>(),
    'Submit Performance Review Success': props<{ message: string }>(),
    'Submit Performance Review Failure': props<{ error: string }>(),
  }
});
