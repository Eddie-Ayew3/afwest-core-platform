import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ShiftDto, CreateShiftDto, UpdateShiftDto, ManualCheckInDto, ManualCheckOutDto, ShiftListParams } from '../models/shift.model';

export const ShiftActions = createActionGroup({
  source: 'Shift',
  events: {
    'Load Shifts': props<{ params?: ShiftListParams }>(),
    'Load Shifts Success': props<{ shifts: ShiftDto[]; totalRecords: number }>(),
    'Load Shifts Failure': props<{ error: string }>(),

    'Create Shift': props<{ dto: CreateShiftDto }>(),
    'Create Shift Success': props<{ shift: ShiftDto }>(),
    'Create Shift Failure': props<{ error: string }>(),

    'Update Shift': props<{ id: string; dto: UpdateShiftDto }>(),
    'Update Shift Success': props<{ shift: ShiftDto }>(),
    'Update Shift Failure': props<{ error: string }>(),

    'Delete Shift': props<{ id: string }>(),
    'Delete Shift Success': props<{ id: string }>(),
    'Delete Shift Failure': props<{ error: string }>(),

    'Start Shift': props<{ id: string }>(),
    'Start Shift Success': props<{ id: string }>(),
    'Start Shift Failure': props<{ error: string }>(),

    'Complete Shift': props<{ id: string }>(),
    'Complete Shift Success': props<{ id: string }>(),
    'Complete Shift Failure': props<{ error: string }>(),

    'Cancel Shift': props<{ id: string; reason?: string }>(),
    'Cancel Shift Success': props<{ id: string }>(),
    'Cancel Shift Failure': props<{ error: string }>(),

    'Mark Missed': props<{ id: string; reason?: string }>(),
    'Mark Missed Success': props<{ id: string }>(),
    'Mark Missed Failure': props<{ error: string }>(),

    'Manual Check In': props<{ id: string; dto: ManualCheckInDto }>(),
    'Manual Check In Success': props<{ id: string }>(),
    'Manual Check In Failure': props<{ error: string }>(),

    'Manual Check Out': props<{ id: string; dto: ManualCheckOutDto }>(),
    'Manual Check Out Success': props<{ id: string }>(),
    'Manual Check Out Failure': props<{ error: string }>(),
  }
});
