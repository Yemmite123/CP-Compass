import { createSelector } from "reselect";

const getUiLoadingStates = state => state.ui.loading;
const getUiErrorStates = state => state.ui.errors;
const getUiAlertStates = state => state.ui.alerts;
const getUiUpdateStates = state => state.ui.updating;

const actionSelector = (_, action) => {
    const matches = /(.*)_(REQUEST|ERROR|SUCCESS|ALERT)/.exec(action);

    if(!matches) {
        return action;
    }

    const prefix = matches[1];
    return prefix;
}

const actionListSelector = (_, actions) => {
    let actionList = [];

    actions.forEach(action => {
        const prefix = actionSelector(_, action);
        actionList.push(prefix);
    })

    return actionList;
}

export const getActionLoadingState = createSelector(
    [getUiLoadingStates, actionSelector],
    (loadingStates, action) => {
        return loadingStates[action]
    }
);

export const getActionErrorState = createSelector(
    [getUiErrorStates, actionSelector],
    (errorStates, action) => {
        return errorStates[action]
    }
)

export const getActionUpdateState = createSelector(
    [getUiUpdateStates, actionSelector],
    (updatingStates, action) => {
        return updatingStates[action]
    }
)

export const getActionsErrorStatesList = createSelector(
    [getUiErrorStates, actionListSelector],
    (errorStates, actions) => {
        let errors = [];

        actions.forEach(action => {
            errors.push(errorStates[action]);
        })

        return errors;
    }
)

export const getActionAlertState = createSelector(
    [getUiAlertStates, actionSelector],
    (alertStates, action) => {
        return alertStates[action]
    }
)