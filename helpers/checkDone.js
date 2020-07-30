const isActivityDone = ( notes ) => {
    const isDone = notes.some( note => note.done === false );

    return !isDone;
};

const isProjectDone = ( activities ) => {
    const isDone = activities.some( activity => activity.done === false );

    return !isDone;
}

module.exports = {
    isActivityDone,
    isProjectDone,
}