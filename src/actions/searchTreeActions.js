export const actionTypes = {
    UPDATE_TREE: "UPDATE_TREE",
    DELETE_TREE: "DELETE_TREE",
};

export const updateTreeAction = (treeJSON) => ({
    type: actionTypes.UPDATE_TREE,
    treeJSON,
});

export const deleteTreeAction = () => ({
    type: actionTypes.DELETE_TREE,
});
