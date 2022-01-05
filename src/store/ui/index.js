
const UI_REDUCER_DEFAULT_STATE = {
    loading: {},
    updating: {},
    errors: {},
    alerts: {},
    modal: {},
}

export default (state = UI_REDUCER_DEFAULT_STATE, action) => {
    const { type, message } = action;
    const { loading } = state;
    const matches = /(.*)_(REQUEST|SUCCESS|ERROR|ALERT|UPDATE|MODAL|CLOSE)/.exec(type);

    if (!matches) {
        return state;
    }

    // eslint-disable-next-line
    const [actionName, actionPrefix, actionState] = matches;
    switch (actionState) {
        case "ALERT":
            return {
                ...state,
                alerts: {
                    [actionPrefix]: message
                }
            }
        case "CLOSE":
            return {
                ...state,
                modal: {
                    [actionPrefix]: false,
                }
            }
            case "CLEAR":
            return {
                ...state,
                alerts: {
                    [actionPrefix]: null
                }
            }
        default:
            return {
                ...state,
                loading: {
                    ...loading,
                    [actionPrefix]: actionState === "REQUEST"
                },
                errors: {
                    [actionPrefix]: actionState === "ERROR" ? message : false
                },
                updating: {
                    ...state.updating,
                    [actionPrefix]: actionState === "UPDATE"
                },
                modal: {
                    ...state.updating,
                    [actionPrefix]: actionState === "MODAL"
                },
                alerts: {
                    ...state.alerts,
                    [actionPrefix]: actionState === "ALERT"
                }
            }
    }
}