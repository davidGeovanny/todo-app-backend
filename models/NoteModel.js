const { Schema, model } = require('mongoose');

const NoteSchema = Schema( {
    text: {
        type: String,
        required: true,
    },
    done: {
        type: Boolean,
        default: false,
    },
    activity: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
    created_at: {
        type: Date,
    },
    updated_at: {
        type: Date,
    },
});

NoteSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    
    return object;
});

module.exports = model('Note', NoteSchema);