const { Schema, model } = require('mongoose');

const ProjectSchema = Schema( {
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    area: {
        type: String,
        required: true,
    },
    done: {
        type: Boolean,
        default: false,
    },
    created_at: {
        type: Date,
    },
    updated_at: {
        type: Date,
    },
});

ProjectSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    
    return object;
});

module.exports = model('Project', ProjectSchema);