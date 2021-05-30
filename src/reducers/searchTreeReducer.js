export const initialTreeState = '{}';

const treeReducer = (treeJSON, action) => {
    switch (action.type) {
        case "UPDATE_TREE":
            return action.treeJSON;
        case "DELETE_TREE":
            return '{}';
        default:
            return treeJSON;
    }
}

export default treeReducer;