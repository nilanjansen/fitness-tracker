import { Action, createFeatureSelector, createSelector } from '@ngrx/store';
import { TrainingActions
    , SET_AVAILABLE_TRAININGS
    , SET_FINISHED_TRAININGS
    , STOP_TRAINING
    , START_TRAINING } from './training.actions';
import * as fromRoot from '../app.reducer';
import { Exercise } from './exercise.model';

export interface TrainingState {
    availableExercises: Exercise[];
    finishedExercises: Exercise[];
    activeTraining: Exercise;
}

export interface State extends fromRoot.State {
    training: TrainingState;
}

const initialState: TrainingState = {
    availableExercises: [],
    finishedExercises: [],
    activeTraining: null
};
export function trainingReducer(state = initialState, action: TrainingActions) {
    switch (action.type) {
        case SET_AVAILABLE_TRAININGS:
            return {
                ...state,
                availableExercises: action.payLoad
            };
        case SET_FINISHED_TRAININGS:
            return {
                ...state,
                finishedExercises: action.payLoad
            };
        case START_TRAINING:
            return {
                ...state,
                activeTraining : { ...state.availableExercises.find
                (ex => ex.id === action.payLoad) }
            };
        case STOP_TRAINING:
            return {
                ...state,
                activeTraining: null
            };
        default: {
            return state;
        }
    }
}

export const getTrainingState = createFeatureSelector<TrainingState>('training');
export const getAvailableExercises = createSelector(getTrainingState, (state: TrainingState) => state.availableExercises);
export const getFinishedExercises = createSelector(getTrainingState,  (state: TrainingState) => state.finishedExercises);
export const getActiveTraining =  createSelector( getTrainingState, (state: TrainingState) => state.activeTraining );
export const getIsTraining =  createSelector( getTrainingState, (state: TrainingState) => state.activeTraining != null );


