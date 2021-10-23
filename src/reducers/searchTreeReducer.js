import { actionTypes } from "../actions/searchTreeActions";

export const initialTreeState = "{}";

const treeReducer = (treeJSON, action) => {
    switch (action.type) {
        case actionTypes.UPDATE_TREE:
            return action.treeJSON;
        case actionTypes.DELETE_TREE:
            return "{}";
        default:
            return treeJSON;
    }
};

export default treeReducer;
