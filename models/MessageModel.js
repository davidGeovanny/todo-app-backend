const { Schema, model } = require('mongoose');

const MessageSchema = Schema( {
    text: {
        type: String,
        required: true,
    },
    activity: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    created_at: {
        type: Date,
    },
    updated_at: {
        type: Date,
    },
});

MessageSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    
    return object;
});

module.exports = model('Message', MessageSchema);